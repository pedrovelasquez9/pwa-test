###PWA con Angular 7

####Entorno

La app progresiva está construída con las siguientes herramientas y versiones:

+ Angular CLI: 7.1.4
+ Node: 11.4.0
+ Angular: 7.1.4
+ @angular-devkit/architect         0.11.4
+ @angular-devkit/build-angular     0.11.4
+ @angular-devkit/build-optimizer   0.11.4
+ @angular-devkit/build-webpack     0.11.4
+ @angular-devkit/core              7.1.4
+ @angular-devkit/schematics        7.1.4
+ @angular/pwa                      0.12.2
+ @ngtools/webpack                  7.1.4
+ @schematics/angular               7.1.4
+ @schematics/update                0.11.4
+ rxjs                              6.3.3
+ typescript                        3.1.6
+ webpack                           4.23.1

####Creación del proyecto 

Si se quiere iniciar una app progresiva desde cero, se deben ejecutar los siguientes comandos:

+ npm install -g @angular/cli (en caso de no tenerlo instalado)
+ ng new -nombre-proyecto- (crea el nuevo proyecto)
+ cd -nombre-proyecto- (sitúa al usuario en la carpeta generada)
+ ng add @angular/pwa agrega las librerías necesarias para crear una app progresiva con angular

Esto agregará el service worker de la app y la configuración base para el funcionamiento de la app progresiva 

####Correr la app en local

Para ejecutar nuestra app progresiva en local se deben ejecutar los siguientes comandos:

+ npm install -g http-server (instala la librería http server para lanzar la app)
+ ng build --prod (construye la app progresiva, para probarla siempre se debe empaquetar para entorno de producción)
+ http-server -c-1 dist/-nombre-proyecto-/ (inicia el server con la app progresiva y la caché habilitada)

####Correr en servidor

Para ejecutar la app en el servidor, se deben realizar algunos cambios siguiendo esta secuencia:

+ Construir build con comando: ng build --prod --base-href "url-server/nombre-proyecto"
+ Una vez construido, se deben cambiar los siguientes archivos generados en la carpeta dist/nombre-proyecto

#####ngsw-worker.js

+ Agregar url del servidor a la línea 2341 donde se llama al ngsw.json, por ejemplo: **const res = yield this.safeFetch(this.adapter.newRequest('https://technoimpact.net/pwa-test/ngsw.json?ngsw-cache-bust=' + Math.random()));**

#####main.bundle

+ Agregar url del servidor a la referencia del ngsw-worker.js, por ejemplo: **"https://technoimpact.net/pwa-test/ngsw-worker.js"**

#####manifest.json

+ Agregar url base a las propiedades **scope** y **start_url**, por ejemplo: **"scope": "https://technoimpact.net/pwa-test/", "start_url": "https://technoimpact.net/pwa-test/",**

####Opción de instalación

Para mostrar el prompt de instalación en el home screen de nuestra app progresiva, podemos agregar lo siguiente al componente principal o al componente donde aplique según la necesidad:

	let deferredPrompt;
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		deferredPrompt = e;		
		deferredPrompt.prompt();
		deferredPrompt.userChoice
			.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the prompt');
				} else {
				console.log('User dismissed the prompt');
				}
				deferredPrompt = null;
			});
		});

Esto verificará si el usuario ha instalado la app progresiva, si no lo ha hecho, mostrará el alert para poder hacerlo

####Actualizaciones de la app

Para notificar al usuario que la app tiene actualizaciones, debemos incluir la siguiente validación en nuestro componente principal o en el componente donde aplique según nuestra necesidad:

	if(this.swUpdate.isEnabled){
		this.swUpdate.available.subscribe(()=>{
		if(confirm("Nueva versión disponible, quieres actualizar?")){
			window.location.reload();
		}
		})
	}

Si se detectan actualizaciones, se abrirá una ventana modal con el mensaje de nueva versión disponible, esto actualizará la app renovando la caché de sus archivos fuentes en la instalación local del usuario.

####Ejemplo de código completo (app.component.ts)

	ngOnInit(){
		let deferredPrompt;
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
		
				deferredPrompt.prompt();
				deferredPrompt.userChoice
				.then((choiceResult) => {
					if (choiceResult.outcome === 'accepted') {
					console.log('User accepted the prompt');
					} else {
					console.log('User dismissed the prompt');
					}
					deferredPrompt = null;
				});
		});

		
		
		if(this.swUpdate.isEnabled){
			this.swUpdate.available.subscribe(()=>{
				if(confirm("Nueva versión disponible, quieres actualizar?")){
					window.location.reload();
				}
			})
		}
	}

####Despliegue en servidor

Para desplegar la app en el servidor, basta con copiar el contenido de la carpeta dist/nombre-proyecto en la ruta de nuestro servidor e ingresar desde el navegador web en nuestro dispositivo

####Notas adicionales 

+ Para que la instalación se pueda hacer, la app debe servirse desde un servidor https y desde una pestaña normal, no de incógnito