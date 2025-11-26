/**
 * Constructor de la clase Header en ES5.
 * @constructor
 */
var Header = function() {
    // Propiedades
    this.y = 0;
    // Asume que 'window["main-header"]' es una forma de acceder al elemento DOM.
    // Si se refiere a un ID, la forma más común es document.getElementById("main-header")
    this.container = document.querySelector("#main-header"); 
    if (!this.container) {
        console.error("El elemento #main-header no existe");
        return;
    }
    // Enlace del evento con el contexto correcto de 'this'
    // La función flecha (e) => this.onScroll() se reemplaza por .bind(this)
    window.addEventListener("scroll", this.onScroll.bind(this));

    // Ejecución inicial de onScroll
    this.onScroll();
};

/**
 * Métodos y Getters definidos en el prototipo de Header
 */
Header.prototype = {
    // Es importante restaurar el constructor
    constructor: Header, 

    /**
     * Getter: Calcula la altura del contenedor
     */
    get height() {
        var _rect = this.container.getBoundingClientRect();
        // El operador ~~ es una función común en JS para convertir a entero redondeado para abajo y es compatible con ES5.
        return ~~_rect.height; 
    },
    
    /**
     * Getter: Determina la dirección del scroll
     */
    get direction() {
        if (this.y > window.scrollY) {
            return "up";
        } else {
            return "down";
        }
    },

    /**
     * Getter: Verifica si el encabezado es visible (tiene la clase 'visible')
     */
    get isVisible() {
        // En ES5, acceder a classList es seguro, pero para máxima compatibilidad con navegadores muy antiguos,
        // se usa la verificación de string, la cual es la lógica original.
        return String(this.container.getAttribute("class")).indexOf("visible") >= 0;
    },
    
    /**
     * Getter: Verifica si el encabezado está en la posición superior (tiene la clase 'in-top')
     */
    get inTop() {
        return String(this.container.getAttribute("class")).indexOf("in-top") >= 0;
    },

    /**
     * Getter: indica si el header está fijado
     */
    get isFixed() {
        return this.container.classList.contains("fixed");
    },

    /**
     * Asigna el valor actual del scroll a la propiedad 'y'
     * @param {number} _y El valor de window.scrollY
     */
    setY: function(_y) {
        this.y = _y;
    },

    /**
     * Manejador del evento scroll
     */
    onScroll: function() {
        // La lógica interna no cambia, pero se usa 'function' en lugar de un método de clase ES6
        if (this.direction === "down") {
            this.scrollDown();
        } else {
            this.scrollUp();
        }
        
        if (window.scrollY === 0 && !this.inTop) {
            this.reset(); // Si está en top 0 reseteamos
        }
        
        return this.setY(window.scrollY); // Asignamos a y el valor de window.scrollY
    },
    
    /**
     * Lógica al hacer scroll hacia abajo
     * UPDATE: Actualizar a que se oculte al momento de pasar el 100% del scroll de la página,
     * o mejor dicho tenga posición relativa, fixed sólo cuando suba el scroll
     */
    scrollDown: function() {
        if (!this.isFixed) return;
        this.hide(this.release.bind(this));
    },

    scrollUp: function() {
        if (window.scrollY <= 0) {
            this.reset();
            return;
        }
        this.pin();
        this.show();
    },
    
    /**
     * Establece el estado "fijo" o inicial de oculto antes de la animación
     */
    pin: function() {
        if (this.isFixed) return;
        this.container.classList.add("fixed");
        this.container.classList.remove("in-top");
        document.body.style.paddingTop = this.height + "px";
        // Asumiendo que 'gsap' está disponible globalmente
        gsap.set(this.container, {
            y: "-100%"
        });
    },

    release: function() {
        if (!this.isFixed) return;
        this.container.classList.remove("fixed");
        document.body.style.paddingTop = "";
        this.container.removeAttribute("style");
        this.container.classList.remove("visible");
    },

    /**
     * Muestra el encabezado (con animación GSAP)
     */
    show: function() {
        if (!this.isFixed) {
            this.pin();
        }
        if (this.isVisible) return false;
        
        this.container.classList.add("visible");
        gsap.to(this.container, {
            duration: 0.4,
            ease: Power2.easeOut,
            y: "0%"
        });
    },

    /**
     * Oculta el encabezado (con animación GSAP)
     */
    hide: function(onComplete) {
        if (!this.isVisible) {
            if (typeof onComplete === "function") {
                onComplete();
            }
            return false;
        }
        
        this.container.classList.remove("visible");
        gsap.to(this.container, {
            duration: 0.3,
            ease: Power2.easeIn,
            onComplete: onComplete || null
        });
    },

    /**
     * Restablece el encabezado a su estado inicial en la parte superior
     */
    reset: function() {
        this.release();
        this.container.classList.add("visible");
        this.container.classList.add("in-top");
    }
};

var headerInstance = new Header();