import React from 'react';
import { GiHeartPlus, GiHand, GiWheat, GiCampfire } from 'react-icons/gi';

export default function HeritageSection() {
  const traditions = [
    {
      icon: GiHeartPlus,
      title: 'The Sacred Gursha (ጉርሻ)',
      desc: 'An act of deep love and friendship where you hand-feed a morsel of injera wrapped around wat into your companion’s mouth. Tradition says you should never give just one gursha — always two or three!'
    },
    {
      icon: GiHand,
      title: 'Communal Mesob Table (መሶብ)',
      desc: 'Diners gather in a circle around an intricately hand-woven colorful straw mesob. Eating together from a single plate represents unity, equality, and shared sustenance.'
    },
    {
      icon: GiWheat,
      title: 'Ancient Highland Teff (ጤፍ)',
      desc: 'Our teff is stone-ground and naturally fermented for three days to create light, spongy, slightly tangy injera that is completely gluten-free and nutrient-dense.'
    },
    {
      icon: GiCampfire,
      title: 'Clarified Niter Kibbeh (ንጥር ቅቤ)',
      desc: 'Grass-fed highland butter slowly clarified and infused for 72 hours with wild sacred herbs including kosseret, besobila, korarima cardamom, and fenugreek.'
    }
  ];

  return (
    <section className="heritage-section" id="heritage">
      <div className="container">
        <div className="section-header-center">
          <div className="badge-hearth">
            <GiHeartPlus />
            <span>ETHIOPIAN & ERITREAN CULINARY TRADITION</span>
          </div>
          <h2 className="section-title">
            Communal Hospitality & <span className="title-highlight">Gursha Culture</span>
          </h2>
          <span className="section-amharic amharic-text">የአንድነትና የፍቅር ማዕድ</span>
          <p className="section-subtitle">
            Dining in the Habesha tradition is an intimate celebration of connection where nobody eats alone.
          </p>
        </div>

        <div className="traditions-grid">
          {traditions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="tradition-card">
                <div className="tradition-icon-box">
                  <Icon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
