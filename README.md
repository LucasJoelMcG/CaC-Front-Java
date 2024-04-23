# Proyecto frontend para el curso de CaC-Fullstrack-Java.

## Detalles del Proyecto

* El sitio se centra en el uso de la API de Imgflip (https://imgflip.com/api). Como se puede observar, el endpoint de creación requiere de pasar usuario y contraseña en el request. Dado que no es una buena práctica exponer tales campos y que además Github puede que detecte esos campos en el repositorio y lo vuelva privado por cuestiones de seguridad, preferí utilizar un backend propio que haga de proxy de forma tal que pueda enviar el request sin los campos user y pass, que el backend se los agregue y devuelva el resultado del endpoint de Imgflip.
* Se utilizó el esquema HTML5, CSS3, Bootstral y JS.
* El searchbox de memes no es reactivo. Se debe presionar "enter" para que realice la búsqueda.
* No implemento spinners de carga de momento.
* Se puede, con tiempo, mejorar mucho la UI.
