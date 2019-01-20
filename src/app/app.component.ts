import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pwa-test';

  constructor(private swUpdate: SwUpdate){

  }

  ngOnInit(){
	let deferredPrompt;
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		deferredPrompt = e;
		let btn = document.getElementById('btnAdd');
	  
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
		btn.addEventListener('click', ()=>{
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
		})
	  });

	//detectar ios
	const isIos = () => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		return /iphone|ipad|ipod/.test( userAgent );
	  }
	  
	  // Checks if should display install popup notification:
	  if (isIos()) {
		let btn = document.getElementById('btnAdd');
		btn.hidden = true;
		alert("Puedes instalar esta PWA desde el menú 'compartir' de safari");
	  }
	  
	  if(this.swUpdate.isEnabled){
		  this.swUpdate.available.subscribe(()=>{
			if(confirm("Nueva versión disponible, quieres actualizar?")){
				window.location.reload();
			}
		  })
	  }
  }
}
