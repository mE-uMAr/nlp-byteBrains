document.addEventListener("DOMContentLoaded", () => {
    // Background animation
    const canvas = document.getElementById("particles-canvas")
    const ctx = canvas.getContext("2d")
  
    // Set canvas dimensions
    function setCanvasDimensions() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  
    setCanvasDimensions()
  
    // Particles configuration
    let particles = []
    const particleConfig = {
      count: Math.min(Math.floor(window.innerWidth / 15), 150),
      sizeMin: 1,
      sizeMax: 3,
      speed: 0.3,
      color: {
        r: [155, 255],
        g: [155, 255],
        b: [155, 255],
        a: [0.2, 0.7],
      },
      connectionDistance: 150,
      connectionOpacity: 0.2,
    }
  
    // Create particles
    function createParticles() {
      particles = []
  
      for (let i = 0; i < particleConfig.count; i++) {
        const size = Math.random() * (particleConfig.sizeMax - particleConfig.sizeMin) + particleConfig.sizeMin
        const r = Math.floor(
          Math.random() * (particleConfig.color.r[1] - particleConfig.color.r[0]) + particleConfig.color.r[0],
        )
        const g = Math.floor(
          Math.random() * (particleConfig.color.g[1] - particleConfig.color.g[0]) + particleConfig.color.g[0],
        )
        const b = Math.floor(
          Math.random() * (particleConfig.color.b[1] - particleConfig.color.b[0]) + particleConfig.color.b[0],
        )
        const a = Math.random() * (particleConfig.color.a[1] - particleConfig.color.a[0]) + particleConfig.color.a[0]
  
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
          density: Math.random() * 30 + 1,
        })
      }
    }
  
    // Mouse position for interactive particles
    const mouse = {
      x: null,
      y: null,
      radius: 150,
    }
  
    window.addEventListener("mousemove", (event) => {
      mouse.x = event.x
      mouse.y = event.y
    })
  
    // Draw particles and connections
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
  
      // Update and draw each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
  
        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)
  
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance
            const forceDirectionY = dy / distance
            const force = (mouse.radius - distance) / mouse.radius
  
            const directionX = forceDirectionX * force * p.density
            const directionY = forceDirectionY * force * p.density
  
            p.x -= directionX
            p.y -= directionY
          } else {
            // Return to base speed when not affected by mouse
            p.speedX = p.baseSpeedX
            p.speedY = p.baseSpeedY
          }
        }
  
        // Update position
        p.x += p.speedX
        p.y += p.speedY
  
        // Boundary check
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
  
        // Draw the particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }
  
      // Draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
  
          if (distance < particleConfig.connectionDistance) {
            const opacity = 1 - distance / particleConfig.connectionDistance
            ctx.beginPath()
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * particleConfig.connectionOpacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
  
      requestAnimationFrame(drawParticles)
    }
  
    // Initialize particles
    createParticles()
    drawParticles()
  
    // Handle window resize
    window.addEventListener("resize", () => {
      setCanvasDimensions()
      createParticles()
    })
  
    // Skills filter functionality
    const filterButtons = document.querySelectorAll(".filter-btn")
    const skillCards = document.querySelectorAll(".skill-card")
    const skillDetailItems = document.querySelectorAll(".skill-detail-item")
  
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        this.classList.add("active")
  
        const filter = this.getAttribute("data-filter")
  
        // Filter skill cards
        skillCards.forEach((card) => {
          if (filter === "all") {
            card.style.display = "block"
          } else {
            if (card.getAttribute("data-category") === filter) {
              card.style.display = "block"
            } else {
              card.style.display = "none"
            }
          }
        })
  
        // Filter skill detail items
        skillDetailItems.forEach((item) => {
          if (filter === "all") {
            item.style.display = "block"
          } else {
            if (item.getAttribute("data-category") === filter) {
              item.style.display = "block"
            } else {
              item.style.display = "none"
            }
          }
        })
      })
    })
  
    // Dynamic skill logos and colors
    const skillColors = {
      javascript: "#F7DF1E",
      python: "#3776AB",
      java: "#007396",
      react: "#61DAFB",
      angular: "#DD0031",
      vue: "#4FC08D",
      node: "#339933",
      html: "#E34F26",
      css: "#1572B6",
      php: "#777BB4",
      ruby: "#CC342D",
      swift: "#FA7343",
      kotlin: "#7F52FF",
      typescript: "#3178C6",
      go: "#00ADD8",
      rust: "#000000",
      "c++": "#00599C",
      "c#": "#239120",
      aws: "#FF9900",
      docker: "#2496ED",
      kubernetes: "#326CE5",
      mongodb: "#47A248",
      mysql: "#4479A1",
      postgresql: "#336791",
      firebase: "#FFCA28",
      git: "#F05032",
      figma: "#F24E1E",
      photoshop: "#31A8FF",
      illustrator: "#FF9A00",
      sketch: "#F7B500",
      communication: "#9333EA",
      leadership: "#EC4899",
      teamwork: "#14B8A6",
      "problem-solving": "#F59E0B",
      creativity: "#EF4444",
      "time-management": "#6366F1",
      adaptability: "#10B981",
      "critical-thinking": "#8B5CF6",
      "emotional-intelligence": "#EC4899",
      negotiation: "#F97316",
    }
  
    // Set skill icons and colors
    function setSkillStyles(elements) {
      elements.forEach((element) => {
        const skillName = element.getAttribute("data-skill")
  
        if (skillColors[skillName]) {
          // Use specific color for known skills
          element.style.background = skillColors[skillName]
  
          // Create text content with first letter
          const firstLetter = skillName.charAt(0).toUpperCase()
          element.textContent = firstLetter
          element.style.color = getContrastColor(skillColors[skillName])
        } else {
          // Generate a consistent color based on the skill name
          const color = generateColorFromString(skillName)
          element.style.background = color
  
          // Create text content with first letter
          const firstLetter = skillName.charAt(0).toUpperCase()
          element.textContent = firstLetter
          element.style.color = getContrastColor(color)
        }
      })
    }
  
    // Apply styles to all skill elements
    setSkillStyles(document.querySelectorAll(".skill-icon-large"))
    setSkillStyles(document.querySelectorAll(".skill-detail-icon"))
  
    // Helper function to determine text color based on background
    function getContrastColor(hexColor) {
      // Convert hex to RGB
      let r, g, b
  
      if (hexColor.startsWith("#")) {
        const hex = hexColor.substring(1)
        r = Number.parseInt(hex.substring(0, 2), 16)
        g = Number.parseInt(hex.substring(2, 4), 16)
        b = Number.parseInt(hex.substring(4, 6), 16)
      } else {
        return "#ffffff" // Default to white for non-hex colors
      }
  
      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
      // Return black or white based on luminance
      return luminance > 0.5 ? "#000000" : "#ffffff"
    }
  
    // Generate a color based on string
    function generateColorFromString(str) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
  
      let color = "#"
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        color += ("00" + value.toString(16)).substr(-2)
      }
  
      return color
    }
  
    // Animate skill bars on page load
    function animateSkillBars() {
      const skillFills = document.querySelectorAll(".skill-level-fill, .skill-detail-fill")
  
      skillFills.forEach((fill) => {
        const width = fill.style.width
        fill.style.width = "0%"
  
        setTimeout(() => {
          fill.style.width = width
        }, 300)
      })
    }
  
    // Call animation function after page load
    setTimeout(animateSkillBars, 500)
  })
  