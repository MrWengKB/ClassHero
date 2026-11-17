let S={loggedIn:0,user:null,data:{activeClassId:null,classes:[],changes:0,lastBackup:0},view:'manage',selStu:null,filter:'all',showDD:0,modal:null,edit:null,form:{cls:{name:'',color:'bgb-c'},stu:'',imp:'',act:{name:'',icon:'Star',color:'bgb-c',pts:10}},login:{u:'',p:''},reg:{n:'',u:'',p:''}};
const $=id=>document.getElementById(id),gCls=()=>S.data.classes.find(c=>c.id===S.data.activeClassId),gSts=()=>gCls()?.students||[],gActs=()=>gCls()?.activities||[],
cTS=s=>gActs().reduce((t,a)=>t+((s?.activityCounts?.[a.id]||0)*a.pointValue),0),
save=()=>S.loggedIn&&S.user&&localStorage.setItem('ch_'+S.user.id,JSON.stringify({...S.data,lastUpdated:Date.now()})),
load=()=>{if(!localStorage.getItem('chS'))localStorage.setItem('chS',JSON.stringify({teachers:[]}));if(S.user){const d=localStorage.getItem('ch_'+S.user.id);if(d){const p=JSON.parse(d);S.data={activeClassId:p.activeClassId||null,classes:(p.classes||[]).map(c=>({...c,students:(c.students||[]).map(s=>({...s,activityCounts:s.activityCounts||{},activityHistory:s.activityHistory||{}}))})),changes:p.changes||0,lastBackup:p.lastBackup||0}}}},
inc=()=>{S.data.changes++;if(S.data.changes>=15&&S.data.changes-S.data.lastBackup>=15){S.modal='backup';render()}save()},
getDate=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
