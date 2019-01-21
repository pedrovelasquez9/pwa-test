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

  ngAfterViewInit(){
	let footer = document.getElementById('footer');
	footer.hidden = true;
	//detectar ios
	const isIos = () => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		return /iphone|ipad|ipod/.test( userAgent );
	  }
	  
	  // Checks if should display install popup notification:
	  if (isIos()) {
		let btn = document.getElementById('btnAdd');
		let footer = document.getElementById('footer');
		btn.hidden = true;
		footer.hidden = false;

	  }
	  
	  if(this.swUpdate.isEnabled){
		  this.swUpdate.available.subscribe(()=>{
			if(confirm("Nueva versión disponible, quieres actualizar?")){
				window.location.reload();
			}
		  })
	  }
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

	
  }
}
