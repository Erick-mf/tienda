window.onload = () => {
    const { createApp } = Vue;

    const app = createApp({
        data() {
            return {
                categorias: [],
                carrito: [],
                productos: [],
                filtro: "precio",
                orden: "ascendente",
                mostrarCarrito: false,
                productSeleccionado: null,
                nombreusuario: "",
                password: "",
                usuarios: JSON.parse(localStorage.getItem("usuarios")) || [],
                mostrarModal: false,
                modalContent: "",
                sesionActiva: false,
                usuario: null,
            };
        },
        methods: {
            obtenerCategorias() {
                fetch("https://fakestoreapi.com/products/categories")
                    .then((response) => response.json())
                    .then((categorias) => {
                        this.categorias = categorias;
                    });
            },
            mostrarTodo() {
                fetch("https://fakestoreapi.com/products")
                    .then((response) => response.json())
                    .then((productos) => {
                        this.productos = this.ordenarProductos([...productos]);
                    });
            },
            mostrarPorCategoria(categoria) {
                fetch(`https://fakestoreapi.com/products/category/${categoria}`)
                    .then((response) => response.json())
                    .then((productos) => {
                        this.productos = this.ordenarProductos([...productos]);
                    });
            },
            cambiarFiltro(filtro) {
                this.filtro = filtro;
            },
            cambiarOrden(orden) {
                this.orden = orden;
            },
            ordenarProductos(productos) {
                return productos.sort((a, b) => {
                    let comparacion = 0;
                    if (this.filtro === "precio") {
                        comparacion = a.price - b.price;
                    } else if (this.filtro === "votos") {
                        comparacion = a.rating.rate - b.rating.rate;
                    } else if (this.filtro === "titulo") {
                        comparacion = a.title.localeCompare(b.title);
                    }
                    return this.orden === "ascendente" ? comparacion : -comparacion;
                });
            },
            agregarAlCarrito(producto) {
                let item = this.carrito.find((item) => item.id === producto.id);
                if (item) {
                    item.quantity++;
                    item.total = item.price * item.quantity;
                } else {
                    this.carrito.push({
                        ...producto,
                        quantity: 1,
                        total: producto.price,
                    });
                }
            },
            eliminarDelCarrito(index) {
                this.carrito.splice(index, 1);
            },
            aumentarCantidad(index) {
                let item = this.carrito[index];
                item.quantity++;
                item.total = item.price * item.quantity;
            },
            reducirCantidad(index) {
                let item = this.carrito[index];
                if (item.quantity > 1) {
                    item.quantity--;
                    item.total = item.price * item.quantity;
                } else {
                    this.eliminarDelCarrito(index);
                }
            },
            pagar() {
                if (this.carrito.length > 0) {
                    alert("Pago realizado con éxito!");
                    this.carrito = [];
                } else {
                    alert("Tu carrito está vacío");
                }
            },
            toggleCarrito() {
                this.mostrarCarrito = !this.mostrarCarrito;
            },
            abrirModal(content) {
                this.mostrarModal = true;
                this.modalContent = content;
            },
            iniciarSesion() {
                const usuario = this.usuarios.find((usuario) => usuario.nombreusuario === this.nombreusuario);
                if (usuario && usuario.password === this.password) {
                    alert("Inicio de sesión exitoso!");
                    this.usuario = this.nombreusuario;
                    this.sesionActiva = true;
                    this.mostrarModal = false;
                    this.nombreusuario = "";
                    this.password = "";
                } else {
                    alert("Nombre de usuario o contraseña incorrectos");
                }
            },
            cerrarSesion() {
                this.usuario = null;
                this.sesionActiva = false;
            },
            registrarse() {
                if (this.usuarios.some((usuario) => usuario.nombreusuario === this.nombreusuario)) {
                    alert("El nombre de usuario ya está en uso");
                } else {
                    this.usuarios.push({ nombreusuario: this.nombreusuario, password: this.password });
                    localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
                    alert("Registro exitoso!");
                    this.mostrarModal = false;
                    this.nombreusuario = "";
                    this.password = "";
                }
            },
        },
        computed: {
            productosMostrados() {
                return this.ordenarProductos([...this.productos]);
            },
            total() {
                return this.carrito.reduce((total, producto) => total + producto.total, 0);
            },
            cantidadArticulos() {
                return this.carrito.reduce((total, producto) => total + producto.quantity, 0);
            },
        },
        mounted() {
            this.obtenerCategorias();
            this.mostrarTodo();
        },
    });

    app.mount("#app");
};
