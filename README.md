# 29-PROYECTO-CLIMA-FuncionalidadesExtra
 
## Funcionalidades
### 1. Historial de Búsquedas

La aplicación almacena hasta cinco búsquedas recientes en el historial, permitiendo a los usuarios volver a ver rápidamente el clima de ciudades previamente consultadas.

- Cómo Funciona: Cuando el usuario busca el clima de una ciudad y país, esta información se guarda en el Local Storage. El historial se muestra en una lista bajo el formulario de búsqueda
- Interacción: Los usuarios pueden hacer clic en cualquier elemento del historial para realizar nuevamente la búsqueda de esa ciudad.

### 2. Cambio de Grados

Los usuarios pueden alternar entre la visualización de temperaturas en grados Celsius y Fahrenheit.

- Cómo Funciona: Al hacer clic en el botón "Cambiar a Fahrenheit", la aplicación cambia la unidad de temperatura. La temperatura se actualiza automáticamente en el resultado.
- Interacción: El botón cambia su texto entre "Cambiar a Celsius" y "Cambiar a Fahrenheit" según la unidad actual.

### 3. Búsqueda por Ubicación

La aplicación permite a los usuarios obtener el clima basado en su ubicación actual utilizando la geolocalización del navegador.

- Cómo Funciona: Al hacer clic en el botón "Usar mi ubicación", la aplicación solicita permiso al usuario para acceder a su ubicación. Una vez obtenida, la aplicación realiza una consulta a la API para mostrar el clima en la ubicación del usuario.
- Interacción: Si la geolocalización no está disponible o es denegada, la aplicación mostrará un mensaje de error.
