import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pwa-test';
  private top;
  private footer;
  private btn;

  constructor(private swUpdate: SwUpdate){
	
  }

  ngAfterViewInit(){
	this.btn = document.getElementById('btnAdd');
	this.footer = document.getElementById('footer');
	this.top = document.getElementById('navbar');
	this.footer.hidden = true;
	this.top.hidden = true;
	//detectar ios
	
	  
	  // Checks if should display install popup notification:
	  if (this.isIPhone()) {
		this.btn.hidden = true;
		this.footer.hidden = false;
	  }

	  if (this.isIPad()) {
		this.btn.hidden = true;
		this.top.hidden = false;
	  }
	  
	  if(this.swUpdate.isEnabled){
		  this.swUpdate.available.subscribe(()=>{
			if(confirm("Nueva versión disponible, quieres actualizar?")){
				window.location.reload();
			}
		  })
	  }

	  window.addEventListener('appinstalled', (event) => {
		console.log('installed');
		this.top.hidden = true;
		this.btn.hidden = true;
		this.footer.hidden = true;
	   });

	   if (window.matchMedia('(display-mode: standalone)').matches) {
		console.log('display-mode is standalone');
		this.top.hidden = true;
		this.btn.hidden = true;
		this.footer.hidden = true;
	  }

	  if (('standalone' in window.navigator) && (window.navigator['standalone'])) {
		console.log('display-mode is standalone');
		this.btn.hidden = true;
		this.footer.hidden = true;
		this.top.hidden = true;
	  }
  }

  	isIPhone = () => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		return /iphone|ipod/.test( userAgent );
	  }

	isIPad = () => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		return /ipad/.test( userAgent );
	}

  getMarginTop(){
	  if(this.isIPad()){
		return "100px";
	  }else{
		  return "0px";
	  }
  }

  getMarginBottom(){
	if(this.isIPhone()){
	  return "100px";
	}else{
		return "0px";
	}
}

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
		this.btn.addEventListener('click', ()=>{
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
