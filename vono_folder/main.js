   // Gestion de la navigation
   document.addEventListener('DOMContentLoaded', function() {
	const navItems = document.querySelectorAll('.nav-item');
	const sections = document.querySelectorAll('.section-content');
	
	navItems.forEach(item => {
		item.addEventListener('click', function(e) {
			e.preventDefault();
			
			// Désactiver tous les items de navigation
			navItems.forEach(navItem => navItem.classList.remove('active'));
			
			// Activer l'item cliqué
			this.classList.add('active');
			
			// Cacher toutes les sections
			sections.forEach(section => section.classList.add('hidden'));
			
			// Afficher la section correspondante
			const targetSection = document.getElementById(`${this.dataset.section}-section`);
			targetSection.classList.remove('hidden');
		});
	});
	
	// -- GRAPHIQUES --
	let chartInstance = null;
	
	function generateChart() {
		const chartType = document.getElementById('chart-type').value;
		const chartData = document.getElementById('chart-data').value.split(',').map(val => Number(val.trim()));
		const chartLabels = document.getElementById('chart-labels').value.split(',').map(val => val.trim());
		const chartTitle = document.getElementById('chart-title').value;
		
		const ctx = document.getElementById('chart-canvas').getContext('2d');
		
		// Détruire le graphique existant s'il y en a un
		if (chartInstance !== null) {
			chartInstance.destroy();
		}
		
		// Générer des couleurs aléatoires pour les barres/segments
		const backgroundColors = chartLabels.map(() => {
			const r = Math.floor(Math.random() * 255);
			const g = Math.floor(Math.random() * 255);
			const b = Math.floor(Math.random() * 255);
			return `rgba(${r}, ${g}, ${b}, 0.7)`;
		});
		
		const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
		
		const config = {
			type: chartType,
			data: {
				labels: chartLabels,
				datasets: [{
					label: chartTitle,
					data: chartData,
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: chartTitle,
						font: {
							size: 16,
							weight: 'bold'
						}
					},
					legend: {
						position: 'bottom'
					}
				}
			}
		};
		
		// Options spécifiques pour certains types de graphiques
		if (chartType === 'bar' || chartType === 'line') {
			config.options.scales = {
				y: {
					beginAtZero: true
				}
			};
		}
		
		// Créer le graphique
		chartInstance = new Chart(ctx, config);
	}
	
	document.getElementById('generate-chart').addEventListener('click', generateChart);
	
	document.getElementById('download-chart').addEventListener('click', function() {
		if (chartInstance !== null) {
			const canvas = document.getElementById('chart-canvas');
			const dataURL = canvas.toDataURL('image/png');
			
			const downloadLink = document.createElement('a');
			downloadLink.href = dataURL;
			downloadLink.download = 'vano-chart.png';
			downloadLink.click();
		} else {
			alert('Veuillez d\'abord générer un graphique.');
		}
	});
	
	// -- ICÔNES --
	const iconCanvas = document.getElementById('icon-canvas');
	const iconCtx = iconCanvas.getContext('2d');
	
	document.getElementById('icon-size').addEventListener('input', function() {
		document.getElementById('icon-size-value').textContent = this.value + 'px';
	});
	
	document.getElementById('icon-fill-color').addEventListener('input', function() {
		document.getElementById('icon-fill-color-value').textContent = this.value;
	});
	
	document.getElementById('icon-stroke-color').addEventListener('input', function() {
		document.getElementById('icon-stroke-color-value').textContent = this.value;
	});
	
	document.getElementById('icon-stroke-width').addEventListener('input', function() {
		document.getElementById('icon-stroke-width-value').textContent = this.value + 'px';
	});
	
	function drawIcon() {
		const iconBase = document.getElementById('icon-base').value;
		const size = parseInt(document.getElementById('icon-size').value);
		const fillColor = document.getElementById('icon-fill-color').value;
		const strokeColor = document.getElementById('icon-stroke-color').value;
		const strokeWidth = parseInt(document.getElementById('icon-stroke-width').value);
		
		// Nettoyer le canvas
		iconCtx.clearRect(0, 0, iconCanvas.width, iconCanvas.height);
		
		// Centrer l'icône
		const centerX = iconCanvas.width / 2;
		const centerY = iconCanvas.height / 2;
		
		iconCtx.fillStyle = fillColor;
		iconCtx.strokeStyle = strokeColor;
		iconCtx.lineWidth = strokeWidth;
		
		switch (iconBase) {
			case 'circle':
				iconCtx.beginPath();
				iconCtx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI);
				iconCtx.fill();
				if (strokeWidth > 0) iconCtx.stroke();
				break;
				
			case 'square':
				iconCtx.beginPath();
				iconCtx.rect(centerX - size / 2, centerY - size / 2, size, size);
				iconCtx.fill();
				if (strokeWidth > 0) iconCtx.stroke();
				break;
				
			case 'triangle':
				iconCtx.beginPath();
				iconCtx.moveTo(centerX, centerY - size / 2);
				iconCtx.lineTo(centerX + size / 2, centerY + size / 2);
				iconCtx.lineTo(centerX - size / 2, centerY + size / 2);
				iconCtx.closePath();
				iconCtx.fill();
				if (strokeWidth > 0) iconCtx.stroke();
				break;
				
			case 'hexagon':
				iconCtx.beginPath();
				for (let i = 0; i < 6; i++) {
					const angle = (Math.PI / 3) * i;
					const x = centerX + size / 2 * Math.cos(angle);
					const y = centerY + size / 2 * Math.sin(angle);
					if (i === 0) iconCtx.moveTo(x, y);
					else iconCtx.lineTo(x, y);
				}
				iconCtx.closePath();
				iconCtx.fill();
				if (strokeWidth > 0) iconCtx.stroke();
				break;
				
			case 'star':
				iconCtx.beginPath();
				const outerRadius = size / 2;
				const innerRadius = size / 5;
				const spikes = 5;
				
				for (let i = 0; i < spikes * 2; i++) {
					const radius = i % 2 === 0 ? outerRadius : innerRadius;
					const angle = (Math.PI / spikes) * i;
					const x = centerX + radius * Math.sin(angle);
					const y = centerY - radius * Math.cos(angle);
					if (i === 0) iconCtx.moveTo(x, y);
					else iconCtx.lineTo(x, y);
				}
				
				iconCtx.closePath();
				iconCtx.fill();
				if (strokeWidth > 0) iconCtx.stroke();
				break;
		}
	}
	
	document.getElementById('generate-icon').addEventListener('click', drawIcon);
	
	document.getElementById('download-icon').addEventListener('click', function() {
		const dataURL = iconCanvas.toDataURL('image/png');
		const downloadLink = document.createElement('a');
		downloadLink.href = dataURL;
		downloadLink.download = 'vano-icon.png';
		downloadLink.click();
	});
	
	// -- FORMES --
	const shapeCanvas = document.getElementById('shape-canvas');
	const shapeCtx = shapeCanvas.getContext('2d');
	
	document.getElementById('shape-type').addEventListener('change', function() {
		const polygonSidesContainer = document.getElementById('polygon-sides-container');
		if (this.value === 'polygon') {
			polygonSidesContainer.classList.remove('hidden');
		} else {
			polygonSidesContainer.classList.add('hidden');
		}
	});
	
	document.getElementById('shape-width').addEventListener('input', function() {
		document.getElementById('shape-width-value').textContent = this.value + 'px';
	});
	
	document.getElementById('shape-height').addEventListener('input', function() {
		document.getElementById('shape-height-value').textContent = this.value + 'px';
	});
	
	document.getElementById('shape-border-radius').addEventListener('input', function() {
		document.getElementById('shape-border-radius-value').textContent = this.value + 'px';
	});
	
	document.getElementById('shape-fill-color').addEventListener('input', function() {
		document.getElementById('shape-fill-color-value').textContent = this.value;
	});
	
	document.getElementById('shape-stroke-color').addEventListener('input', function() {
		document.getElementById('shape-stroke-color-value').textContent = this.value;
	});
	
	document.getElementById('shape-stroke-width').addEventListener('input', function() {
		document.getElementById('shape-stroke-width-value').textContent = this.value + 'px';
	});
	
	document.getElementById('polygon-sides').addEventListener('input', function() {
		document.getElementById('polygon-sides-value').textContent = this.value + ' côtés';
	});
	
	function drawShape() {
		const shapeType = document.getElementById('shape-type').value;
		const width = parseInt(document.getElementById('shape-width').value);
		const height = parseInt(document.getElementById('shape-height').value);
		const borderRadius = parseInt(document.getElementById('shape-border-radius').value);
		const fillColor = document.getElementById('shape-fill-color').value;
		const strokeColor = document.getElementById('shape-stroke-color').value;
		const strokeWidth = parseInt(document.getElementById('shape-stroke-width').value);
		
		// Nettoyer le canvas
		shapeCtx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
		
		// Centrer la forme
		const centerX = shapeCanvas.width / 2;
		const centerY = shapeCanvas.height / 2;
		
		shapeCtx.fillStyle = fillColor;
		shapeCtx.strokeStyle = strokeColor;
		shapeCtx.lineWidth = strokeWidth;
		
		switch (shapeType) {
			case 'rectangle':
				if (borderRadius === 0) {
					shapeCtx.beginPath();
					shapeCtx.rect(centerX - width / 2, centerY - height / 2, width, height);
					shapeCtx.fill();
					if (strokeWidth > 0) shapeCtx.stroke();
				} else {
					shapeCtx.beginPath();
					shapeCtx.moveTo(centerX - width / 2 + borderRadius, centerY - height / 2);
					shapeCtx.lineTo(centerX + width / 2 - borderRadius, centerY - height / 2);
					shapeCtx.arcTo(centerX + width / 2, centerY - height / 2, centerX + width / 2, centerY - height / 2 + borderRadius, borderRadius);
					shapeCtx.lineTo(centerX + width / 2, centerY + height / 2 - borderRadius);
					shapeCtx.arcTo(centerX + width / 2, centerY + height / 2, centerX + width / 2 - borderRadius, centerY + height / 2, borderRadius);
					shapeCtx.lineTo(centerX - width / 2 + borderRadius, centerY + height / 2);
					shapeCtx.arcTo(centerX - width / 2, centerY + height / 2, centerX - width / 2, centerY + height / 2 - borderRadius, borderRadius);
					shapeCtx.lineTo(centerX - width / 2, centerY - height / 2 + borderRadius);
					shapeCtx.arcTo(centerX - width / 2, centerY - height / 2, centerX - width / 2 + borderRadius, centerY - height / 2, borderRadius);
					shapeCtx.closePath();
					shapeCtx.fill();
					if (strokeWidth > 0) shapeCtx.stroke();
				}
				break;
				
			case 'circle':
				shapeCtx.beginPath();
				shapeCtx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
				shapeCtx.fill();
				if (strokeWidth > 0) shapeCtx.stroke();
				break;
				
			case 'triangle':
				shapeCtx.beginPath();
				shapeCtx.moveTo(centerX, centerY - height / 2);
				shapeCtx.lineTo(centerX + width / 2, centerY + height / 2);
				shapeCtx.lineTo(centerX - width / 2, centerY + height / 2);
				shapeCtx.closePath();
				shapeCtx.fill();
				if (strokeWidth > 0) shapeCtx.stroke();
				break;
				
			case 'polygon':
				const sides = parseInt(document.getElementById('polygon-sides').value);
				const radius = Math.min(width, height) / 2;
				
				shapeCtx.beginPath();
				for (let i = 0; i < sides; i++) {
					const angle = (2 * Math.PI / sides) * i - Math.PI / 2;
					const x = centerX + radius * Math.cos(angle);
					const y = centerY + radius * Math.sin(angle);
					if (i === 0) shapeCtx.moveTo(x, y);
					else shapeCtx.lineTo(x, y);
				}
				shapeCtx.closePath();
				shapeCtx.fill();
				if (strokeWidth > 0) shapeCtx.stroke();
				break;
				
			case 'star':
				const outerRadius = Math.min(width, height) / 2;
				const innerRadius = outerRadius / 2.5;
				const spikes = 5;
				
				shapeCtx.beginPath();
				for (let i = 0; i < spikes * 2; i++) {
					const radius = i % 2 === 0 ? outerRadius : innerRadius;
					const angle = (Math.PI / spikes) * i - Math.PI / 2;
					const x = centerX + radius * Math.cos(angle);
					const y = centerY + radius * Math.sin(angle);
					if (i === 0) shapeCtx.moveTo(x, y);
					else shapeCtx.lineTo(x, y);
				}
				shapeCtx.closePath();
				shapeCtx.fill();
				if (strokeWidth > 0) shapeCtx.stroke();
				break;
				
			case 'heart':
				const heartSize = Math.min(width, height) / 2;
				
				shapeCtx.beginPath();
				shapeCtx.moveTo(centerX, centerY + heartSize / 3);
				
				// Dessiner la courbe du cœur
				shapeCtx.bezierCurveTo(
					centerX, centerY - heartSize / 3,
					centerX - heartSize, centerY - heartSize / 3,
					centerX, centerY - heartSize
				);
				shapeCtx.bezierCurveTo(
					centerX + heartSize, centerY - heartSize / 3,
					centerX, centerY - heartSize / 3,
					centerX, centerY + heartSize / 3
				);
				
				shapeCtx.fill();
				if (strokeWidth > 0) shapeCtx.stroke();
				break;
		}
	}
	
	document.getElementById('generate-shape').addEventListener('click', drawShape);
	
	document.getElementById('download-shape').addEventListener('click', function() {
		const dataURL = shapeCanvas.toDataURL('image/png');
		const downloadLink = document.createElement('a');
		downloadLink.href = dataURL;
		downloadLink.download = 'vano-shape.png';
		downloadLink.click();
	});
	
	// -- IMAGES --
	const imageCanvas = document.getElementById('image-canvas');
	const imageCtx = imageCanvas.getContext('2d');
	
	document.getElementById('image-width').addEventListener('input', function() {
		document.getElementById('image-width-value').textContent = this.value + 'px';
	});
	
	document.getElementById('image-height').addEventListener('input', function() {
		document.getElementById('image-height-value').textContent = this.value + 'px';
	});
	
	document.getElementById('image-primary-color').addEventListener('input', function() {
		document.getElementById('image-primary-color-value').textContent = this.value;
	});
	
	document.getElementById('image-secondary-color').addEventListener('input', function() {
		document.getElementById('image-secondary-color-value').textContent = this.value;
	});
	
	document.getElementById('image-complexity').addEventListener('input', function() {
		document.getElementById('image-complexity-value').textContent = this.value;
	});
	
	function hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
	
	function generateImage() {
		const imageType = document.getElementById('image-type').value;
		const width = parseInt(document.getElementById('image-width').value);
		const height = parseInt(document.getElementById('image-height').value);
		const primaryColor = document.getElementById('image-primary-color').value;
		const secondaryColor = document.getElementById('image-secondary-color').value;
		const complexity = parseInt(document.getElementById('image-complexity').value);
		
		// Mettre à jour les dimensions du canvas
		imageCanvas.width = width;
		imageCanvas.height = height;
		
		// Nettoyer le canvas
		imageCtx.clearRect(0, 0, width, height);
		
		switch (imageType) {
			case 'pattern':
				generatePattern(width, height, primaryColor, secondaryColor, complexity);
				break;
				
			case 'abstract':
				generateAbstract(width, height, primaryColor, secondaryColor, complexity);
				break;
				
			case 'gradient':
				generateGradient(width, height, primaryColor, secondaryColor);
				break;
				
			case 'noise':
				generateNoise(width, height, primaryColor, secondaryColor, complexity);
				break;
		}
	}
	
	function generatePattern(width, height, color1, color2, complexity) {
		const size = Math.max(10, Math.floor(Math.min(width, height) / (complexity * 2)));
		
		// Fond
		imageCtx.fillStyle = color1;
		imageCtx.fillRect(0, 0, width, height);
		
		imageCtx.fillStyle = color2;
		
		for (let x = 0; x < width; x += size * 2) {
			for (let y = 0; y < height; y += size * 2) {
				imageCtx.fillRect(x, y, size, size);
			}
		}
		
		for (let x = size; x < width; x += size * 2) {
			for (let y = size; y < height; y += size * 2) {
				imageCtx.fillRect(x, y, size, size);
			}
		}
	}
	
	function generateAbstract(width, height, color1, color2, complexity) {
		// Fond
		imageCtx.fillStyle = color1;
		imageCtx.fillRect(0, 0, width, height);
		
		const rgb1 = hexToRgb(color1);
		const rgb2 = hexToRgb(color2);
		
		// Nombre de formes
		const numShapes = complexity * 5;
		
		for (let i = 0; i < numShapes; i++) {
			// Couleur aléatoire entre les deux couleurs
			const r = Math.floor(rgb1.r + (rgb2.r - rgb1.r) * Math.random());
			const g = Math.floor(rgb1.g + (rgb2.g - rgb1.g) * Math.random());
			const b = Math.floor(rgb1.b + (rgb2.b - rgb1.b) * Math.random());
			const alpha = 0.4 + Math.random() * 0.6;
			
			imageCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
			
			// Type de forme aléatoire
			const shapeType = Math.floor(Math.random() * 3);
			
			// Position et taille aléatoires
			const x = Math.random() * width;
			const y = Math.random() * height;
			const size = Math.random() * (width / 4) + 20;
			
			switch (shapeType) {
				case 0: // Cercle
					imageCtx.beginPath();
					imageCtx.arc(x, y, size / 2, 0, Math.PI * 2);
					imageCtx.fill();
					break;
					
				case 1: // Rectangle
					imageCtx.fillRect(x - size / 2, y - size / 2, size, size);
					break;
					
				case 2: // Triangle
					imageCtx.beginPath();
					imageCtx.moveTo(x, y - size / 2);
					imageCtx.lineTo(x + size / 2, y + size / 2);
					imageCtx.lineTo(x - size / 2, y + size / 2);
					imageCtx.closePath();
					imageCtx.fill();
					break;
			}
		}
	}
	
	function generateGradient(width, height, color1, color2) {
		// Créer un dégradé linéaire
		const gradient = imageCtx.createLinearGradient(0, 0, width, height);
		gradient.addColorStop(0, color1);
		gradient.addColorStop(1, color2);
		
		imageCtx.fillStyle = gradient;
		imageCtx.fillRect(0, 0, width, height);
	}
	
	function generateNoise(width, height, color1, color2, complexity) {
		const rgb1 = hexToRgb(color1);
		const rgb2 = hexToRgb(color2);
		
		// Taille du pixel de bruit
		const pixelSize = Math.max(1, Math.floor(11 - complexity));
		
		for (let x = 0; x < width; x += pixelSize) {
			for (let y = 0; y < height; y += pixelSize) {
				// Couleur aléatoire entre les deux couleurs
				const ratio = Math.random();
				const r = Math.floor(rgb1.r + (rgb2.r - rgb1.r) * ratio);
				const g = Math.floor(rgb1.g + (rgb2.g - rgb1.g) * ratio);
				const b = Math.floor(rgb1.b + (rgb2.b - rgb1.b) * ratio);
				
				imageCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
				imageCtx.fillRect(x, y, pixelSize, pixelSize);
			}
		}
	}
	
	document.getElementById('generate-image').addEventListener('click', generateImage);
	
	document.getElementById('download-image').addEventListener('click', function() {
		const dataURL = imageCanvas.toDataURL('image/png');
		const downloadLink = document.createElement('a');
		downloadLink.href = dataURL;
		downloadLink.download = 'vano-image.png';
		downloadLink.click();
	});
	
	// Initialiser l'application avec le premier graphique
	generateChart();
});
