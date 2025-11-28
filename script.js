// Sistema de gestión de inventario y ventas

// Arrays para almacenar los datos de la aplicación
let products = [];          // Lista de todos los productos
let currentSale = [];       // Productos en la venta actual
let salesHistory = [];      // Historial de ventas realizadas

// Productos iniciales 
const initialProducts = [
    { 
        id: 1, 
        name: "Oud Majestic", 
        price: 119.99, 
        stock: 8, 
        category: "unisex",
        image: "https://www.revolvefragrances.com/cdn/shop/products/MajesticOud100ml_2.jpg?v=1649492020",
        description: "Exclusivo perfume Oud con notas amaderadas y especiadas, aroma moderno ideal para la noche y ocasiones especiales."
    },
    { 
        id: 2, 
        name: "Yara Candy", 
        price: 115.50, 
        stock: 12, 
        category: "women",
        image: "https://www.eadistribution.co.uk/wp-content/uploads/2024/11/Yara-candy-2.png",
        description: "Fragancia femenina con notas de ámbar, flores blancas y un toque de vainilla."
    },
    { 
        id: 3, 
        name: "Mandarine Sky", 
        price: 49.99, 
        stock: 15, 
        category: "men",
        image: "https://perfumesmb.com.ec/wp-content/uploads/2023/07/odyssey-mandarin-sky.jpg",
        description: "Fragancia fresca con notas cítricas para uso diario."
    }
];


// Cargar datos guardados en el localStorage al iniciar
function loadData() {
    const savedData = localStorage.getItem('royalFragances_data');
    
    if (savedData) {
        try {
            // Si hay datos guardados, cargarlos
            const parsedData = JSON.parse(savedData);
            products = parsedData.products || [];
            salesHistory = parsedData.salesHistory || [];
        } catch (error) {
            // Si hay error, usar productos iniciales
            products = [...initialProducts];
        }
    } else {
        // Si no hay datos, usar productos iniciales
        products = [...initialProducts];
    }
}

// Guardar datos en el localStorage
function saveData() {
    const appData = {
        products: products,
        salesHistory: salesHistory
    };
    localStorage.setItem('royalFragances_data', JSON.stringify(appData));
}

// Mostrar una sección específica y ocultar las demás
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionId).style.display = 'block';
    
    // Actualizar navegación activa
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Actualizar contenido específico de cada sección
    if (sectionId === 'dashboard') {
        updateDashboard();
        updateStockAlerts();
    } else if (sectionId === 'catalog') {
        displayCatalogProducts('all');
    } else if (sectionId === 'sales') {
        updateSaleDisplay();
    } else if (sectionId === 'stock') {
        displayStockItems();
    }
}

// Actualizar las estadísticas del dashboard
function updateDashboard() {
    const totalProducts = products.length;
    const menProducts = products.filter(p => p.category === 'men').length;
    const womenProducts = products.filter(p => p.category === 'women').length;
    const unisexProducts = products.filter(p => p.category === 'unisex').length; // Productos unisex
    const lowStock = products.filter(p => p.stock <= 5).length; // Productos con 5 o menos unidades
    
    // Actualizar los valores en el HTML
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('men-products').textContent = menProducts;
    document.getElementById('women-products').textContent = womenProducts;
    document.getElementById('unisex-products').textContent = unisexProducts;
    document.getElementById('low-stock').textContent = lowStock;
}

// Mostrar alertas de productos con stock bajo
function updateStockAlerts() {
    const stockAlerts = document.getElementById('stock-alerts');
    stockAlerts.innerHTML = '';
    
    // Filtrar productos con stock bajo (5 o menos unidades)
    const lowStockProducts = products.filter(p => p.stock <= 5);
    
    if (lowStockProducts.length === 0) {
        stockAlerts.innerHTML = '<p>No hay productos con stock bajo</p>';
        return;
    }
    
    // Crear una alerta para cada producto con stock bajo
    lowStockProducts.forEach(product => {
        const alertCard = document.createElement('div');
        alertCard.className = 'alert-card';
        alertCard.innerHTML = `
            <div class="alert-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="alert-content">
                <h4>Stock Bajo: ${product.name}</h4>
                <p>Solo quedan ${product.stock} unidades disponibles.</p>
            </div>
        `;
        stockAlerts.appendChild(alertCard);
    });
}

// Mostrar productos en el catálogo para clientes
function displayCatalogProducts(category) {
    const catalogGrid = document.getElementById('catalog-grid');
    catalogGrid.innerHTML = '';
    
    // Filtrar productos por categoría o mostrar todos
    let productsToDisplay = category === 'all' ? products : products.filter(p => p.category === category);
    
    if (productsToDisplay.length === 0) {
        catalogGrid.innerHTML = '<p>No hay productos para mostrar</p>';
        return;
    }
    
    // Crear tarjeta para cada producto
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-stock">
                    <i class="fas fa-box"></i>
                    <span>Unidades disponibles: ${product.stock}</span>
                </div>
                <p>${product.description}</p>
            </div>
        `;
        catalogGrid.appendChild(productCard);
    });
}

// Mostrar productos en el modal para seleccionar en ventas
function displayProductsForSelection() {
    const modalProductsGrid = document.getElementById('modal-products-grid');
    modalProductsGrid.innerHTML = '';
    
    // Mostrar solo productos con stock disponible
    products.forEach(product => {
        if (product.stock > 0) {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <>
                    <div class="product-stock">
                        <i class="fas fa-box"></i> Stock disponible: ${product.stock}
                    </div>
                    <button class="btn add-to-sale" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                </div>
            `;
            modalProductsGrid.appendChild(productCard);
        }
    });

    // Agregar eventos a los botones de agregar a venta
    document.querySelectorAll('.add-to-sale').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addProductToSale(productId);
            document.getElementById('product-modal').classList.remove('active');
        });
    });
}

// Agregar un producto a la venta actual
function addProductToSale(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Verificar si el producto ya está en la venta
    const existingItem = currentSale.find(item => item.id === productId);
    
    if (existingItem) {
        // Si ya está, aumentar cantidad si hay stock
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
        } else {
            showMessage('No hay suficiente stock disponible', 'error');
            return;
        }
    } else {
        // Si no está, agregarlo con cantidad 1
        currentSale.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateSaleDisplay();
}

// Actualizar la visualización de la venta actual
function updateSaleDisplay() {
    const saleItems = document.getElementById('sale-items');
    saleItems.innerHTML = '';
    
    if (currentSale.length === 0) {
        saleItems.innerHTML = '<p>No hay productos en la venta</p>';
        document.getElementById('sale-total').textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    // Mostrar cada producto en la venta
    currentSale.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const saleItem = document.createElement('div');
        saleItem.className = 'sale-item';
        saleItem.innerHTML = `
            <div class="sale-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="sale-item-details">
                <div class="sale-item-name">${item.name}</div>
                <div class="sale-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="sale-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                </div>
                <button class="btn remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        saleItems.appendChild(saleItem);
    });
    
    // Actualizar total
    document.getElementById('sale-total').textContent = `$${total.toFixed(2)}`;
    
    // Agregar eventos a los botones de control de cantidad
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            decreaseQuantity(productId);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            increaseQuantity(productId);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromSale(productId);
        });
    });
}

// Disminuir cantidad de un producto en la venta
function decreaseQuantity(productId) {
    const item = currentSale.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateSaleDisplay();
    }
}

// Aumentar cantidad de un producto en la venta
function increaseQuantity(productId) {
    const item = currentSale.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (item && product && item.quantity < product.stock) {
        item.quantity += 1;
        updateSaleDisplay();
    } else {
        showMessage('No hay suficiente stock disponible', 'error');
    }
}

// Eliminar producto de la venta
function removeFromSale(productId) {
    currentSale = currentSale.filter(item => item.id !== productId);
    updateSaleDisplay();
}

// Completar el proceso de venta
function completeSaleProcess() {
    if (currentSale.length === 0) {
        showMessage('No hay productos en la venta', 'error');
        return;
    }
    
    // Crear registro de la venta
    const saleRecord = {
        id: salesHistory.length + 1,
        date: new Date().toLocaleDateString('es-ES'),
        items: [...currentSale],
        total: currentSale.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    // Agregar al historial
    salesHistory.push(saleRecord);
    
    // Actualizar stock de productos vendidos
    currentSale.forEach(saleItem => {
        const product = products.find(p => p.id === saleItem.id);
        if (product) {
            product.stock -= saleItem.quantity;
        }
    });
    
    // Calcular total
    const total = currentSale.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    showMessage(`Venta completada por $${total.toFixed(2)}`, 'success');
    
    // Guardar datos
    saveData();
    
    // Limpiar venta actual
    currentSale = [];
    updateSaleDisplay();
    
    // Actualizar todas las vistas
    updateDashboard();
    updateStockAlerts();
    displayCatalogProducts('all');
    displayStockItems();
}

// Mostrar productos en la gestión de inventario
function displayStockItems() {
    const stockItems = document.getElementById('stock-items');
    stockItems.innerHTML = '';
    
    if (products.length === 0) {
        stockItems.innerHTML = '<p>No hay productos en el inventario</p>';
        return;
    }
    
    // Mostrar cada producto con opciones de gestión
    products.forEach(product => {
        const stockItem = document.createElement('div');
        stockItem.className = 'stock-item';
        stockItem.innerHTML = `
            <div class="stock-item-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="stock-item-details">
                <div class="stock-item-name">${product.name}</div>
                <div class="stock-item-info">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <span class="product-stock">Stock: ${product.stock}</span>
                </div>
            </div>
            <div class="stock-item-actions">
                <input type="number" class="stock-input" id="stock-input-${product.id}" value="0" min="0">
                <button class="btn add-stock" data-id="${product.id}">
                    <i class="fas fa-plus"></i> Agregar
                </button>
                <button class="btn btn-danger delete-product" data-id="${product.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        stockItems.appendChild(stockItem);
    });
    
    // Eventos para agregar stock
    document.querySelectorAll('.add-stock').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const input = document.getElementById(`stock-input-${productId}`);
            const quantity = parseInt(input.value);
            
            if (quantity > 0) {
                addStockToProduct(productId, quantity);
                input.value = 0;
            } else {
                showMessage('Ingresa una cantidad válida', 'error');
            }
        });
    });
    
    // Eventos para eliminar productos
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

// Agregar stock a un producto existente
function addStockToProduct(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.stock += quantity;
        showMessage(`Se agregaron ${quantity} unidades a ${product.name}`, 'success');
        saveData();
        displayStockItems();
        updateDashboard();
        updateStockAlerts();
    }
}

// Eliminar producto del inventario
function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Pedir confirmación antes de eliminar
    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar el producto "${product.name}"?\nEsta acción no se puede deshacer.`);
    
    if (confirmDelete) {
        // Eliminar producto del array
        products = products.filter(p => p.id !== productId);
        showMessage(`Producto "${product.name}" eliminado correctamente`, 'success');
        saveData();
        
        // Actualizar todas las vistas
        displayStockItems();
        updateDashboard();
        updateStockAlerts();
        displayCatalogProducts('all');
        
        // Si el producto estaba en venta actual, quitarlo
        currentSale = currentSale.filter(item => item.id !== productId);
        updateSaleDisplay();
    }
}

// Manejar el envío del formulario para agregar nuevo producto
function handleProductSubmit(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value.trim();
    const description = document.getElementById('product-description').value.trim();
    
    // Validar campos obligatorios
    if (!name || isNaN(price) || isNaN(stock) || !category) {
        showMessage('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Usar imagen por defecto si no se proporciona
    const productImage = image || 'https://images.unsplash.com/photo-1590736969955-1eb1ca6c4c1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80';
    
    // Crear nuevo producto
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price,
        stock,
        category,
        image: productImage,
        description
    };
    
    // Agregar producto y mostrar mensaje
    products.push(newProduct);
    showMessage('Perfume agregado exitosamente', 'success');
    
    // Guardar y actualizar vistas
    saveData();
    document.getElementById('product-form').reset();
    updateDashboard();
    updateStockAlerts();
    displayCatalogProducts('all');
    displayStockItems();
}

// Mostrar mensajes temporales al usuario
function showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
    `;
    
    document.body.appendChild(messageEl);
    
    // Eliminar mensaje después de 3 segundos
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// Inicializar la aplicación
function init() {
    // Cargar datos al iniciar
    loadData();
    showSection('dashboard');
    
    // Eventos de navegación
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Eventos de filtros del catálogo
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            displayCatalogProducts(filter);
        });
    });
    
    // Eventos principales
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
    document.getElementById('add-product-sale').addEventListener('click', function() {
        displayProductsForSelection();
        document.getElementById('product-modal').classList.add('active');
    });
    document.getElementById('close-product-modal').addEventListener('click', function() {
        document.getElementById('product-modal').classList.remove('active');
    });
    document.getElementById('complete-sale').addEventListener('click', completeSaleProcess);
    document.getElementById('refresh-stock').addEventListener('click', function() {
        displayStockItems();
        showMessage('Inventario actualizado', 'success');
    });
    
    // Eventos de acciones rápidas
    document.getElementById('quick-sale').addEventListener('click', function() {
        showSection('sales');
    });
    document.getElementById('quick-stock').addEventListener('click', function() {
        showSection('stock');
    });
    document.getElementById('quick-product').addEventListener('click', function() {
        showSection('admin');
    });
    
    // Cerrar modal haciendo clic fuera
    document.getElementById('product-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // Inicializar vistas
    updateDashboard();
    updateStockAlerts();
    displayCatalogProducts('all');
    displayStockItems();
}

// Iniciar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', init);1