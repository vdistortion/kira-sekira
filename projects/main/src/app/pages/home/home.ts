import { Component, inject, signal, afterNextRender, ElementRef, PendingTasks } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { DirectusService, Contacts } from 'shared';
@Component({selector:'app-home',imports:[RouterLink,FormsModule],templateUrl:'./home.html',styleUrl:'./home.scss'})
export class Home {
  private studio=inject(DirectusService);
  private title=inject(Title);
  private meta=inject(Meta);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  readonly about=!!inject(ActivatedRoute).snapshot.data['about'];
  copy=signal<any>(null); galleries=signal<any[]>([]); contacts=signal<Contacts|null>(null);
  aboutHtml=signal(''); homeIntroHtml=signal(''); failed=signal(false); step=signal(0); answers=signal<string[]>([]); date='';
  constructor(){inject(PendingTasks).run(()=>this.load());afterNextRender(()=>this.decorateHero());}
  async load(){
    try{
      const [site,contacts]=await Promise.all([this.studio.getMainSite(),this.studio.getContacts()]);
      const c=site.events_content;
      if(!c||!Array.isArray(c.quizQuestions)||c.quizQuestions.length!==4)throw new Error('Events content not initialized');
      this.copy.set(c);this.galleries.set(site.galleries||[]);this.contacts.set(contacts);
      const portrait=(site.main_photo_url||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;');
      this.aboutHtml.set(c.aboutHtml.replace('/assets/kira-sekira-portrait.jpg',portrait));
      const intro=c.introHtml.replace('<div class="visual events-hero-photo">', '<div class="visual hero-collage"><div class="hero-triptych"><img src="/assets/DSC_8970.webp" alt="Бокалы на праздничном вечере" width="1000" height="714"><img src="/assets/DSC_9507.webp" alt="Выступление на сцене — чёрно-белый кадр" width="1000" height="714"><img src="/assets/DSC_9890.webp" alt="Гости праздника с именинником" width="1000" height="714"></div>');
      this.homeIntroHtml.set(portrait ? intro.replace(
        /(<section class="dark"><div class="split">)(<small>.*?<\/small>)/,
        `$1<div class="approach-portrait">$2<img src="${portrait}" alt="Кира Секира с камерой" width="2048" height="2048" loading="lazy"></div>`,
      ) : intro);
      this.title.setTitle(this.about?'Обо мне — Кира Секира':c.seoTitle);
      this.meta.updateTag({name:'description',content:c.seoDescription});
      this.meta.updateTag({property:'og:title',content:c.seoTitle});
      this.meta.updateTag({property:'og:description',content:c.seoDescription});
      if(typeof requestAnimationFrame!=='undefined')requestAnimationFrame(()=>this.decorateHero());
    }catch(error){console.error('Events page load failed',error);this.failed.set(true);}
  }
  private decorateHero(){
    const hero=this.host.nativeElement.querySelector<HTMLElement>('.events-hero-photo');
    const cover=this.galleries().find(g=>g.cover_url)?.cover_url;
    if(hero&&cover)hero.style.backgroundImage=`url("${encodeURI(cover).replace(/"/g,'%22')}")`;
  }
  choose(value:string){const next=this.answers().slice();next[this.step()]=value;this.answers.set(next);this.step.update(v=>v+1);}
  chooseDate(){if(this.date)this.choose(this.date);}
  back(){this.step.update(v=>Math.max(0,v-1));}
  restart(){this.step.set(0);}
  estimate():number|null{const i=this.copy().quizQuestions[1].options.indexOf(this.answers()[1]);return i<0||i>4?null:i===0?this.copy().singleHourPrice:(i+1)*this.copy().ratePerHour;}
  formattedEstimate(){const v=this.estimate();return v===null?this.copy().customPriceLabel:`${v.toLocaleString('ru-RU')} ₽`;}
  private message(){const c=this.copy();return c.messageIntro+'\n'+this.answers().map((a,i)=>`${c.messageQuestions[i]}: ${a}`).join('\n');}
  messenger(kind:'telegram'|'whatsapp'):string|null{
    const value=this.contacts()?.[kind];if(!value)return null;
    try{const u=new URL(value.startsWith('http')?value:`https://${value}`);const allowed=kind==='telegram'?['t.me','telegram.me']:['wa.me','api.whatsapp.com'];if(!allowed.includes(u.hostname)||u.protocol!=='https:')return null;u.searchParams.set('text',this.message());return u.toString();}catch{return null;}
  }
  phoneHref(){return 'tel:'+(this.contacts()?.phone||'').replace(/[^+\d]/g,'');}
}
