var DATA={"days":[{"name":"Lundi","color":"#7A1F3D","tasks":[{"id":"0-0","time":"17h00 – 19h00","subject":"Reseaux","desc":"TP à rendre"},{"id":"0-1","time":"19h00 – 23h00","subject":"Statistiques","desc":"Tout réviser !!!"}]},{"name":"Mardi","color":"#3E63A8","tasks":[{"id":"1-0","time":"19h30 – 21h15","subject":"SE","desc":"Terminer le TD + cours"},{"id":"1-1","time":"21h30 – 23h00","subject":"MSI","desc":"Terminer le TD + cours"}]},{"name":"Mercredi","color":"#2F8F5B","tasks":[{"id":"2-0","time":"19h30 – 20h30","subject":"GE","desc":"Faire le TD2"},{"id":"2-1","time":"20h30 – 21h30","subject":"GP","desc":"Terminer l’exercice"},{"id":"2-2","time":"21h45 – 23h00","subject":"RO","desc":"Vidéo YouTube"}]},{"name":"Jeudi","color":"#C28A1B","tasks":[{"id":"3-0","time":"19h30 – 21h15","subject":"P Backend","desc":"Cours + recherche"},{"id":"3-1","time":"21h30 – 23h00","subject":"POO","desc":"TP + recherche"}]},{"name":"Vendredi","color":"#7B4FA3","tasks":[{"id":"4-0","time":"19h30 – 21h15","subject":"EI","desc":"À réviser"},{"id":"4-1","time":"21h30 – 23h00","subject":"Anglais","desc":"À réviser"}]}]};
var KEY="edt-semaine-v1",PAL=["#7A1F3D","#3E63A8","#2F8F5B","#C28A1B","#7B4FA3","#B5532C","#2A8A8A"];
var art=true,editing=false,draft=null,checks={};
try{checks=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){checks={}}
try{var sv=JSON.parse(localStorage.getItem("edt-data-v1")||"null");if(sv&&sv.days)DATA=sv}catch(e){}
function saveChecks(){try{localStorage.setItem(KEY,JSON.stringify(checks))}catch(e){}}
function $(id){return document.getElementById(id)}
function el(tag,cls,txt){var n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n}
function msg(t){$("msg").textContent=t||""}
function uid(){return "n"+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
var root=$("days");
function render(){
  root.innerHTML="";
  var days=editing?draft.days:DATA.days;
  days.forEach(function(d,i){
    var s=el("section");s.style.setProperty("--c",d.color);
    if(editing){
      var dn=el("input","dayname");dn.type="text";dn.value=d.name;dn.setAttribute("aria-label","Nom du jour");
      dn.addEventListener("input",function(){d.name=dn.value});s.appendChild(dn);
      d.tasks.forEach(function(t,j){
        var r=el("div","row");
        r.appendChild(field(t,"time","Horaire (ex. 19h30 – 21h00)",""));
        r.appendChild(field(t,"subject","Matière",""));
        r.appendChild(field(t,"desc","Tâche à faire","wide"));
        var rm=el("button",null,"Supprimer cette tâche");
        rm.addEventListener("click",function(){d.tasks.splice(j,1);render()});r.appendChild(rm);
        s.appendChild(r);
      });
      var add=el("button",null,"Ajouter une tâche");
      add.addEventListener("click",function(){d.tasks.push({id:uid(),time:"",subject:"",desc:""});render()});
      s.appendChild(add);
      if(!d.tasks.length){
        var rd=el("button",null,"Supprimer le jour");rd.style.marginLeft="8px";
        rd.addEventListener("click",function(){draft.days.splice(i,1);render()});s.appendChild(rd);
      }
    }else{
      s.appendChild(el("h2",null,d.name));
      d.tasks.forEach(function(t){
        var l=el("label","task"),c=el("input");c.type="checkbox";c.checked=!!checks[t.id];
        c.addEventListener("change",function(){checks[t.id]=c.checked;saveChecks();update()});
        var b=el("span");b.appendChild(el("span","m",t.subject));
        b.appendChild(document.createTextNode(" "));
        b.appendChild(el("span","d",t.desc?"– "+t.desc:""));
        b.appendChild(el("span","t",t.time));
        l.appendChild(c);l.appendChild(b);s.appendChild(l);
      });
    }
    root.appendChild(s);
  });
  update();
}
function field(t,key,ph,cls){
  var i=el("input",cls);i.type="text";i.value=t[key];i.placeholder=ph;i.setAttribute("aria-label",ph);
  i.addEventListener("input",function(){t[key]=i.value});return i;
}
function update(){
  var all=root.querySelectorAll("input[type=checkbox]"),n=0;
  all.forEach(function(c){if(c.checked)n++});
  $("bar").style.width=(all.length?100*n/all.length:0)+"%";
  $("count").textContent=n+" sur "+all.length+" tâches terminées";
}
function mode(on){
  editing=on;
  $("edit").hidden=on||!art;$("save").hidden=!on;$("cancel").hidden=!on;
  $("prog").hidden=on;$("viewfoot").hidden=on;$("addday").hidden=!on;
  $("sub").textContent=on?"Modifie les horaires et les tâches, puis enregistre.":"Coche chaque tâche quand elle est terminée.";
  msg("");render();
}
$("edit").addEventListener("click",function(){draft=JSON.parse(JSON.stringify(DATA));mode(true)});
$("cancel").addEventListener("click",function(){draft=null;mode(false)});
$("addday").addEventListener("click",function(){
  draft.days.push({name:"Nouveau jour",color:PAL[draft.days.length%PAL.length],tasks:[]});render();
});
$("reset").addEventListener("click",function(){checks={};saveChecks();render()});
$("save").addEventListener("click",function(){
  var clean={days:draft.days.map(function(d){return{name:d.name.trim()||"Jour",color:d.color,tasks:d.tasks.map(function(t){
    return{id:t.id,time:t.time.trim(),subject:t.subject.trim(),desc:t.desc.trim()}
  }).filter(function(t){return t.time||t.subject||t.desc})}})};
  DATA=clean;draft=null;
  try{localStorage.setItem("edt-data-v1",JSON.stringify(clean))}catch(e){}
  mode(false);msg("Enregistré sur cet appareil.");
});
render();
$("edit").hidden=false;
