(module
  ;; Import JavaScript functions
  (import "env" "memory" (memory 1))
  (import "env" "log" (func $log (param i32 i32)))
  (import "env" "random" (func $random (result f32)))
  
  ;; Constants
  (global $width (mut i32) (i32.const 0))
  (global $height (mut i32) (i32.const 0))
  (global $num_particles (mut i32) (i32.const 100))
  
  ;; Particle structure (16 bytes per particle)
  ;; 0-3: x position (f32)
  ;; 4-7: y position (f32)
  ;; 8-11: x velocity (f32)
  ;; 12-15: y velocity (f32)
  
  ;; Initialize particles
  (func $init_particles (param $w i32) (param $h i32) (param $num i32)
    ;; Store width, height, and number of particles
    (global.set $width (local.get $w))
    (global.set $height (local.get $h))
    (global.set $num_particles (local.get $num))
    
    ;; Initialize particles with random positions and velocities
    (local $i i32)
    (local $offset i32)
    (local.set $i (i32.const 0))
    
    (block $init_loop
      (loop $particle_loop
        ;; Check if we've initialized all particles
        (br_if $init_loop (i32.eq (local.get $i) (local.get $num)))
        
        ;; Calculate memory offset for this particle
        (local.set $offset (i32.mul (local.get $i) (i32.const 16)))
        
        ;; Set random x position (0 to width)
        (f32.store (local.get $offset)
          (f32.mul 
            (call $random) 
            (f32.convert_i32_s (local.get $w))
          )
        )
        
        ;; Set random y position (0 to height)
        (f32.store (i32.add (local.get $offset) (i32.const 4))
          (f32.mul 
            (call $random) 
            (f32.convert_i32_s (local.get $h))
          )
        )
        
        ;; Set random x velocity (-1 to 1)
        (f32.store (i32.add (local.get $offset) (i32.const 8))
          (f32.sub 
            (f32.mul (call $random) (f32.const 2.0)) 
            (f32.const 1.0)
          )
        )
        
        ;; Set random y velocity (-1 to 1)
        (f32.store (i32.add (local.get $offset) (i32.const 12))
          (f32.sub 
            (f32.mul (call $random) (f32.const 2.0)) 
            (f32.const 1.0)
          )
        )
        
        ;; Increment counter and continue loop
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $particle_loop)
      )
    )
  )
  
  ;; Update particle positions
  (func $update_particles
    (local $i i32)
    (local $offset i32)
    (local $x f32)
    (local $y f32)
    (local $vx f32)
    (local $vy f32)
    (local.set $i (i32.const 0))
    
    (block $update_loop
      (loop $particle_loop
        ;; Check if we've updated all particles
        (br_if $update_loop (i32.eq (local.get $i) (global.get $num_particles)))
        
        ;; Calculate memory offset for this particle
        (local.set $offset (i32.mul (local.get $i) (i32.const 16)))
        
        ;; Load current position and velocity
        (local.set $x (f32.load (local.get $offset)))
        (local.set $y (f32.load (i32.add (local.get $offset) (i32.const 4))))
        (local.set $vx (f32.load (i32.add (local.get $offset) (i32.const 8))))
        (local.set $vy (f32.load (i32.add (local.get $offset) (i32.const 12))))
        
        ;; Update position
        (local.set $x (f32.add (local.get $x) (local.get $vx)))
        (local.set $y (f32.add (local.get $y) (local.get $vy)))
        
        ;; Wrap around screen edges
        (if (f32.lt (local.get $x) (f32.const 0))
          (then
            (local.set $x (f32.convert_i32_s (global.get $width)))
          )
        )
        (if (f32.gt (local.get $x) (f32.convert_i32_s (global.get $width)))
          (then
            (local.set $x (f32.const 0))
          )
        )
        (if (f32.lt (local.get $y) (f32.const 0))
          (then
            (local.set $y (f32.convert_i32_s (global.get $height)))
          )
        )
        (if (f32.gt (local.get $y) (f32.convert_i32_s (global.get $height)))
          (then
            (local.set $y (f32.const 0))
          )
        )
        
        ;; Store updated position
        (f32.store (local.get $offset) (local.get $x))
        (f32.store (i32.add (local.get $offset) (i32.const 4)) (local.get $y))
        
        ;; Increment counter and continue loop
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $particle_loop)
      )
    )
  )
  
  ;; Get particle data for rendering
  (func $get_particle_data (param $index i32) (result f32 f32)
    (local $offset i32)
    
    ;; Calculate memory offset for this particle
    (local.set $offset (i32.mul (local.get $index) (i32.const 16)))
    
    ;; Return x and y position
    (f32.load (local.get $offset))
    (f32.load (i32.add (local.get $offset) (i32.const 4)))
  )
  
  ;; Get number of particles
  (func $get_num_particles (result i32)
    (global.get $num_particles)
  )
  
  ;; Export functions
  (export "initParticles" (func $init_particles))
  (export "updateParticles" (func $update_particles))
  (export "getParticleData" (func $get_particle_data))
  (export "getNumParticles" (func $get_num_particles))
)