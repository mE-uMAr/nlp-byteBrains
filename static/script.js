document.addEventListener('DOMContentLoaded', function() {
    const fileUpload = document.getElementById('file-upload');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const submitBtn = document.getElementById('submit-btn');
    const uploadForm = document.getElementById('upload-form');
    const loadingContainer = document.getElementById('loading-container');
    const uploadArea = document.getElementById('upload-area');
    const removeFile = document.getElementById('remove-file');
    const progressBar = document.getElementById('progress-bar');
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setCanvasDimensions();
    
    // Particles configuration
    let particles = [];
    const particleConfig = {
        count: Math.min(Math.floor(window.innerWidth / 15), 150),
        sizeMin: 1,
        sizeMax: 3,
        speed: 0.3,
        color: {
            r: [155, 255],
            g: [155, 255],
            b: [155, 255],
            a: [0.2, 0.7]
        },
        connectionDistance: 150,
        connectionOpacity: 0.2
    };
    
    // Create particles
    function createParticles() {
        particles = [];
        
        for (let i = 0; i < particleConfig.count; i++) {
            const size = Math.random() * (particleConfig.sizeMax - particleConfig.sizeMin) + particleConfig.sizeMin;
            const r = Math.floor(Math.random() * (particleConfig.color.r[1] - particleConfig.color.r[0]) + particleConfig.color.r[0]);
            const g = Math.floor(Math.random() * (particleConfig.color.g[1] - particleConfig.color.g[0]) + particleConfig.color.g[0]);
            const b = Math.floor(Math.random() * (particleConfig.color.b[1] - particleConfig.color.b[0]) + particleConfig.color.b[0]);
            const a = Math.random() * (particleConfig.color.a[1] - particleConfig.color.a[0]) + particleConfig.color.a[0];
            
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: size,
                color: `rgba(${r}, ${g}, ${b}, ${a})`,
                speedX: (Math.random() - 0.5) * particleConfig.speed,
                speedY: (Math.random() - 0.5) * particleConfig.speed,
                // Add mouse interaction properties
                baseSpeedX: (Math.random() - 0.5) * particleConfig.speed,
                baseSpeedY: (Math.random() - 0.5) * particleConfig.speed,
                density: (Math.random() * 30) + 1
            });
        }
    }
    
    // Mouse position for interactive particles
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Draw particles and connections
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw each particle
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    const directionX = forceDirectionX * force * p.density;
                    const directionY = forceDirectionY * force * p.density;
                    
                    p.x -= directionX;
                    p.y -= directionY;
                } else {
                    // Return to base speed when not affected by mouse
                    p.speedX = p.baseSpeedX;
                    p.speedY = p.baseSpeedY;
                }
            }
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Boundary check
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            // Draw the particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
        
        // Draw connections between particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < particleConfig.connectionDistance) {
                    const opacity = 1 - (distance / particleConfig.connectionDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * particleConfig.connectionOpacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(drawParticles);
    }
    
    // Initialize particles
    createParticles();
    drawParticles();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        setCanvasDimensions();
        createParticles();
    });
    
    // File upload event
    fileUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            fileName.textContent = file.name;
            fileInfo.classList.add('active');
            submitBtn.disabled = false;
            
            // Add file type icon based on extension
            const fileExtension = file.name.split('.').pop().toLowerCase();
            let fileIconClass = 'file-icon';
            
            if (['pdf'].includes(fileExtension)) {
                fileIconClass += ' pdf-icon';
            } else if (['doc', 'docx'].includes(fileExtension)) {
                fileIconClass += ' doc-icon';
            }
            
            // Add animation to file info
            fileInfo.style.animation = 'none';
            setTimeout(() => {
                fileInfo.style.animation = 'fadeIn 0.5s ease';
            }, 10);
        } else {
            fileInfo.classList.remove('active');
            submitBtn.disabled = true;
        }
    });
    
    // Remove file button
    if (removeFile) {
        removeFile.addEventListener('click', function() {
            fileUpload.value = '';
            fileInfo.classList.remove('active');
            submitBtn.disabled = true;
        });
    }
    
    // Form submit event
    uploadForm.addEventListener('submit', function(e) {
        loadingContainer.classList.add('active');
        
        // Simulate progress (this will be replaced by actual upload progress in production)
        let progress = 0;
        const progressInterval = setInterval(function() {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
            
            if (progress === 100) {
                clearInterval(progressInterval);
            }
        }, 300);
    });
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileUpload.files = e.dataTransfer.files;
            const file = e.dataTransfer.files[0];
            fileName.textContent = file.name;
            fileInfo.classList.add('active');
            submitBtn.disabled = false;
        }
    });
    
    // Add click event to upload area
    uploadArea.addEventListener('click', function(e) {
        if (e.target !== fileUpload) {
            fileUpload.click();
        }
    });
    
    // Add hover effects for buttons
    const buttons = document.querySelectorAll('.submit-btn, .file-input-label');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});