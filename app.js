
(function(){
  const data = window.CATALOG || [];
  const grid = document.getElementById('grid');
  const q = document.getElementById('q');
  const sel = (id)=>document.getElementById(id);
  const bodySel = sel('body'), fuelSel=sel('fuel'), driveSel=sel('drive'), regionSel=sel('region'), budgetSel=sel('budget');

  function uniq(arr){return [...new Set(arr.filter(Boolean))].sort()}

  function fillOptions(el, values){
    values.forEach(v => { const o = document.createElement('option'); o.value=v; o.textContent=v; el.appendChild(o); });
  }
  fillOptions(bodySel, uniq(data.map(x=>x.bodyType)));
  fillOptions(fuelSel, uniq(data.map(x=>x.fuelType)));
  fillOptions(driveSel, uniq(data.map(x=>x.driveType)));
  fillOptions(regionSel, uniq(data.map(x=>x.region)));
  const budgets = uniq(data.map(x=>x.budget));
  fillOptions(budgetSel, budgets);

  function render(){
    const term = (q.value||'').toLowerCase();
    const fBody = bodySel.value, fFuel = fuelSel.value, fDrive=driveSel.value, fRegion=regionSel.value, fBudget=budgetSel.value;
    grid.innerHTML = '';
    let shown = 0;
    data.forEach(item=>{
      if(term){
        const s = `${item.brand} ${item.model}`.toLowerCase();
        if(!s.includes(term)) return;
      }
      if(fBody && item.bodyType !== fBody) return;
      if(fFuel && item.fuelType !== fFuel) return;
      if(fDrive && item.driveType !== fDrive) return;
      if(fRegion && item.region !== fRegion) return;
      if(fBudget && item.budget !== fBudget) return;

      const card = document.createElement('a');
      card.href = `cars/${item.id}.html`;
      card.target = '_blank';
      card.className = 'card card-link';

      const slider = document.createElement('div');
      slider.className = 'slider';
      const imgs = item.images || [];
      imgs.forEach((src, i)=>{
        const d = document.createElement('div');
        d.className = 'slide' + (i===0 ? ' active' : '');
        const im = document.createElement('img');
        im.loading = 'lazy'; im.src = src;
        d.appendChild(im);
        slider.appendChild(d);
      });
      if(imgs.length > 1){
        const nav = document.createElement('div'); nav.className='nav';
        const bL = document.createElement('button'); bL.textContent='‹';
        const bR = document.createElement('button'); bR.textContent='›';
        nav.appendChild(bL); nav.appendChild(bR);
        slider.appendChild(nav);
        let idx = 0;
        const show = (n)=>{
          idx = (n + imgs.length) % imgs.length;
          [...slider.querySelectorAll('.slide')].forEach((s,i)=>s.classList.toggle('active', i===idx));
        };
        bL.addEventListener('click', (e)=>{e.preventDefault(); show(idx-1);});
        bR.addEventListener('click', (e)=>{e.preventDefault(); show(idx+1);});
      }

      const meta = document.createElement('div'); meta.className='meta';
      const title = document.createElement('div'); title.className='title';
      title.textContent = `${item.brand||''} ${item.model||''} ${item.year||''}`.trim();
      const pills = document.createElement('div'); pills.className='pills';
      const mk = (t)=>{ if(!t) return null; const s=document.createElement('span'); s.className='pill'; s.textContent=t; return s; };
      [item.bodyType, item.fuelType, item.driveType, item.region].forEach(x=>{ const el = mk(x); if(el) pills.appendChild(el); });

      meta.appendChild(title);
      meta.appendChild(pills);

      card.appendChild(slider);
      card.appendChild(meta);
      grid.appendChild(card);
      shown++;
    });
    if(!shown){
      grid.innerHTML = '<div class="small">Ничего не найдено. Попробуйте ослабить фильтры.</div>';
    }
  }

  [q, bodySel, fuelSel, driveSel, regionSel, budgetSel].forEach(el=>el.addEventListener('input', render));
  render();
})();
