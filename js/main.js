window.onload = () => {
    const { createApp } = Vue;

    const app = createApp({
        data() {
            return {
                categorias: [],
                carrito: [],
                productos: [],
                filtro: "precio",
                order: "ascendente",
                total: 0,
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
                this.mostrarTodo();
            },
            cambiarOrden(orden) {
                this.orden = orden;
                this.mostrarTodo();
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
                this.total += producto.price;
            },
            eliminarDelCarrito(index) {
                let item = this.carrito[index];
                this.total -= item.total;
                this.carrito.splice(index, 1);
            },
            aumentarCantidad(index) {
                let item = this.carrito[index];
                item.quantity++;
                item.total = item.price * item.quantity;
                this.total += item.price;
            },
            reducirCantidad(index) {
                let item = this.carrito[index];
                if (item.quantity > 1) {
                    item.quantity--;
                    item.total = item.price * item.quantity;
                    this.total -= item.price;
                } else {
                    this.eliminarDelCarrito(index);
                }
            },
        },
        mounted() {
            this.obtenerCategorias();
            this.mostrarTodo();
        },
    });

    app.mount("#app");
};
