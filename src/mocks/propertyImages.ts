// ============================================================
// FILE ẢNH BẤT ĐỘNG SẢN - DALAT KEY STAY
// ============================================================
// Để thay ảnh thật: thay link bên dưới bằng:
//   - Link ảnh online: 'https://...'
//   - Ảnh trong thư mục public: '/images/ten-anh.jpg'
//
// Cấu trúc thư mục nếu dùng ảnh local:
//   public/
//     images/
//       rental/       ← ảnh nhà cho thuê
//       homestay/     ← ảnh homestay
//       apartment/    ← ảnh căn hộ
// ============================================================

// ─────────────────────────────────────────
// NHÀ CHO THUÊ (rental)
// ─────────────────────────────────────────

export const rentalImages: Record<number, { main: string; gallery: string[] }> = {
  // Căn 1 – Nhà vườn nguyên căn view thung lũng
  1: {
    main: 'https://readdy.ai/api/search-image?query=beautiful%20cozy%20Vietnamese%20house%20in%20Dalat%20surrounded%20by%20pine%20trees%20and%20flowers%20misty%20mountain%20valley%20view%20garden%20with%20roses%20and%20hydrangeas%20warm%20lighting%20wooden%20architecture%20colonial%20style&width=800&height=500&seq=r1&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=beautiful%20cozy%20Vietnamese%20house%20in%20Dalat%20surrounded%20by%20pine%20trees%20and%20flowers%20misty%20mountain%20valley%20view%20garden%20with%20roses%20and%20hydrangeas%20warm%20lighting%20wooden%20architecture%20colonial%20style&width=1200&height=700&seq=r1&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cozy%20living%20room%20Vietnamese%20house%20Dalat%20interior%20warm%20wooden%20furniture%20fireplace%20flower%20arrangement%20comfortable%20sofa%20green%20plants%20large%20windows%20natural%20light&width=1200&height=700&seq=r1b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=master%20bedroom%20Vietnamese%20house%20Dalat%20pine%20forest%20view%20large%20windows%20white%20linen%20cozy%20wooden%20bed%20natural%20light%20morning%20mist&width=1200&height=700&seq=r1c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=modern%20kitchen%20Vietnamese%20house%20Dalat%20marble%20countertops%20wooden%20cabinets%20bright%20natural%20light%20flower%20vase%20window%20garden%20view&width=1200&height=700&seq=r1d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=elegant%20bathroom%20Vietnamese%20house%20Dalat%20white%20tiles%20soaking%20tub%20window%20view%20pine%20trees%20bright%20clean%20interior&width=1200&height=700&seq=r1e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=lush%20garden%20Vietnamese%20house%20Dalat%20roses%20hydrangeas%20flower%20beds%20stone%20pathway%20misty%20morning%20green%20landscape%20serene&width=1200&height=700&seq=r1f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=second%20bedroom%20Vietnamese%20house%20Dalat%20cozy%20single%20beds%20wooden%20furniture%20study%20desk%20window%20view%20green%20pine%20trees&width=1200&height=700&seq=r1g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=evening%20view%20Vietnamese%20house%20Dalat%20warm%20golden%20lights%20exterior%20misty%20mountain%20backdrop%20garden%20illuminated%20twilight&width=1200&height=700&seq=r1h&orientation=landscape',
    ],
  },

  // Căn 2 – Biệt thự Pháp cổ nguyên căn trung tâm
  2: {
    main: 'https://readdy.ai/api/search-image?query=French%20colonial%20villa%20in%20Dalat%20Vietnam%20elegant%20architecture%20large%20garden%20with%20flower%20beds%20misty%20cool%20weather%20pine%20trees%20surrounding%20classic%20European%20style%20mansion&width=800&height=500&seq=r2&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=French%20colonial%20villa%20in%20Dalat%20Vietnam%20elegant%20architecture%20large%20garden%20with%20flower%20beds%20misty%20cool%20weather%20pine%20trees%20surrounding%20classic%20European%20style%20mansion&width=1200&height=700&seq=r2&orientation=landscape',
      'https://readdy.ai/api/search-image?query=grand%20living%20room%20French%20villa%20Dalat%20high%20ceilings%20vintage%20chandelier%20antique%20furniture%20fireplace%20parquet%20floors%20elegant%20decor&width=1200&height=700&seq=r2b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=master%20suite%20French%20villa%20Dalat%20elegant%20bedroom%20king%20bed%20white%20bedding%20tall%20windows%20garden%20view%20vintage%20furniture%20ornate%20ceiling&width=1200&height=700&seq=r2c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=gourmet%20kitchen%20French%20villa%20Dalat%20marble%20island%20granite%20counters%20stainless%20appliances%20bright%20airy%20window%20herbs%20garden&width=1200&height=700&seq=r2d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=luxurious%20master%20bathroom%20French%20villa%20Dalat%20freestanding%20soaking%20tub%20double%20vanity%20mosaic%20tiles%20classic%20fixtures&width=1200&height=700&seq=r2e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=expansive%20garden%20French%20villa%20Dalat%20manicured%20lawns%20rose%20bushes%20trimmed%20hedges%20stone%20pathway%20fountain%20misty%20morning&width=1200&height=700&seq=r2f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=dining%20room%20French%20villa%20Dalat%20large%20table%20crystal%20chandelier%20French%20windows%20garden%20view%20formal%20setting&width=1200&height=700&seq=r2g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=terrace%20French%20villa%20Dalat%20wrought%20iron%20railing%20view%20of%20garden%20pine%20trees%20afternoon%20light%20outdoor%20dining%20set&width=1200&height=700&seq=r2h&orientation=landscape',
      'https://readdy.ai/api/search-image?query=study%20library%20French%20villa%20Dalat%20wooden%20bookshelves%20fireplace%20leather%20armchair%20classic%20reading%20nook%20warm%20ambiance&width=1200&height=700&seq=r2i&orientation=landscape',
    ],
  },

  // Căn 3 – Nhà phố 3 tầng khu dân cư yên tĩnh
  3: {
    main: 'https://readdy.ai/api/search-image?query=modern%20Vietnamese%20townhouse%203%20floors%20in%20Dalat%20clean%20white%20facade%20small%20garden%20in%20front%20cool%20misty%20weather%20pine%20trees%20neighborhood%20residential%20area&width=800&height=500&seq=r3&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=modern%20Vietnamese%20townhouse%203%20floors%20in%20Dalat%20clean%20white%20facade%20small%20garden%20in%20front%20cool%20misty%20weather%20pine%20trees%20neighborhood%20residential%20area&width=1200&height=700&seq=r3&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bright%20open%20plan%20living%20room%20modern%20townhouse%20Dalat%20minimalist%20sofa%20wooden%20coffee%20table%20large%20window%20city%20view%20clean%20lines&width=1200&height=700&seq=r3b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cozy%20bedroom%20modern%20house%20Dalat%20grey%20tones%20soft%20lighting%20wooden%20floors%20wardrobe%20window%20view%20pine%20trees%20neat%20interior&width=1200&height=700&seq=r3c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=modern%20kitchen%20townhouse%20Dalat%20white%20cabinets%20dark%20countertops%20clean%20bright%20breakfast%20bar%20stools%20window%20herb%20garden&width=1200&height=700&seq=r3d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=clean%20modern%20bathroom%20townhouse%20Dalat%20white%20tiles%20glass%20shower%20rainfall%20head%20bright%20minimalist%20design&width=1200&height=700&seq=r3e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=rooftop%20terrace%20townhouse%20Dalat%20outdoor%20seating%20potted%20plants%20city%20view%20mountains%20in%20distance%20peaceful%20afternoon&width=1200&height=700&seq=r3f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=children%20bedroom%20townhouse%20Dalat%20colorful%20wall%20playful%20furniture%20window%20garden%20view%20bright%20natural%20lighting&width=1200&height=700&seq=r3g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=front%20yard%20garden%20townhouse%20Dalat%20flower%20beds%20small%20lawn%20gate%20pathway%20cool%20misty%20morning%20neighborhood&width=1200&height=700&seq=r3h&orientation=landscape',
    ],
  },

  // Căn 4 – Căn nhà gỗ view đồi thông Phường 12
  4: {
    main: 'https://readdy.ai/api/search-image?query=wooden%20cabin%20house%20in%20Dalat%20pine%20forest%20hillside%20rustic%20charm%20cozy%20interior%20warm%20glow%20foggy%20atmosphere%20nature%20surrounding%20romantic%20countryside&width=800&height=500&seq=r4&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=wooden%20cabin%20house%20in%20Dalat%20pine%20forest%20hillside%20rustic%20charm%20cozy%20interior%20warm%20glow%20foggy%20atmosphere%20nature%20surrounding%20romantic%20countryside&width=1200&height=700&seq=r4&orientation=landscape',
      'https://readdy.ai/api/search-image?query=rustic%20wooden%20cabin%20living%20room%20Dalat%20pine%20forest%20view%20stone%20fireplace%20log%20burning%20cozy%20armchairs%20sheepskin%20rug%20warm%20amber%20light&width=1200&height=700&seq=r4b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cabin%20bedroom%20Dalat%20wood%20paneled%20walls%20loft%20style%20white%20linen%20pine%20tree%20view%20morning%20light%20cozy%20rustic%20charm&width=1200&height=700&seq=r4c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=wooden%20cabin%20kitchen%20Dalat%20compact%20functional%20rustic%20wooden%20counters%20cast%20iron%20stove%20kettle%20herbs%20window%20pine%20forest%20view&width=1200&height=700&seq=r4d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cabin%20bathroom%20Dalat%20wooden%20walls%20stone%20basin%20rain%20shower%20natural%20materials%20warm%20lighting%20towels%20wicker%20baskets&width=1200&height=700&seq=r4e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=wooden%20deck%20cabin%20Dalat%20pine%20forest%20panorama%20morning%20mist%20hammock%20outdoor%20chairs%20sunrise%20view%20natural%20tranquil%20setting&width=1200&height=700&seq=r4f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cabin%20dining%20area%20Dalat%20wooden%20table%20benches%20rustic%20lanterns%20warm%20candlelight%20pine%20forest%20window%20view%20intimate%20atmosphere&width=1200&height=700&seq=r4g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=pine%20forest%20path%20cabin%20Dalat%20night%20stars%20lanterns%20lit%20pathway%20romantic%20evening%20tall%20pine%20trees%20cool%20air&width=1200&height=700&seq=r4h&orientation=landscape',
    ],
  },

  // Căn 5 – Nhà mái ngói 2 tầng gần Hồ Xuân Hương
  5: {
    main: 'https://readdy.ai/api/search-image?query=charming%202%20storey%20Vietnamese%20house%20with%20tile%20roof%20near%20lake%20in%20Dalat%20flower%20garden%20hydrangeas%20morning%20mist%20view%20scenic%20waterfront%20neighborhood&width=800&height=500&seq=r5&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=charming%202%20storey%20Vietnamese%20house%20with%20tile%20roof%20near%20lake%20in%20Dalat%20flower%20garden%20hydrangeas%20morning%20mist%20view%20scenic%20waterfront%20neighborhood&width=1200&height=700&seq=r5&orientation=landscape',
      'https://readdy.ai/api/search-image?query=warm%20living%20room%20tile%20roof%20house%20Dalat%20lake%20view%20windows%20hydrangea%20flowers%20classic%20Vietnamese%20decor%20wooden%20furniture%20carpet&width=1200&height=700&seq=r5b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=master%20bedroom%20lake%20view%20house%20Dalat%20white%20linen%20wood%20floors%20balcony%20morning%20mist%20Xuan%20Huong%20lake%20distant%20view&width=1200&height=700&seq=r5c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=kitchen%20dining%20tile%20roof%20house%20Dalat%20Vietnamese%20home%20cooking%20area%20bright%20natural%20light%20herbs%20windowsill%20flowers%20view&width=1200&height=700&seq=r5d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bathroom%20tile%20roof%20house%20Dalat%20flower%20arrangement%20window%20sill%20white%20tiles%20clean%20warm%20lighting%20natural%20ventilation&width=1200&height=700&seq=r5e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=garden%20Dalat%20house%20hydrangeas%20colorful%20flower%20beds%20morning%20mist%20stone%20path%20garden%20chairs%20outdoor%20sitting%20area%20serene&width=1200&height=700&seq=r5f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=balcony%20tile%20roof%20house%20Dalat%20lake%20view%20Xuan%20Huong%20morning%20coffee%20chairs%20view%20misty%20calm%20water%20reflection&width=1200&height=700&seq=r5g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=second%20bedroom%20house%20Dalat%20cozy%20twin%20beds%20wardrobe%20flowers%20window%20view%20neighborhood%20pine%20trees%20natural%20light&width=1200&height=700&seq=r5h&orientation=landscape',
    ],
  },

  // Căn 6 – Nhà vườn rộng khu ngoại ô Xuân Thọ
  6: {
    main: 'https://readdy.ai/api/search-image?query=spacious%20countryside%20house%20in%20Dalat%20Xuan%20Tho%20village%20large%20vegetable%20garden%20strawberry%20farm%20misty%20green%20hills%20peaceful%20rural%20life%20traditional%20Vietnamese%20architecture&width=800&height=500&seq=r6&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=spacious%20countryside%20house%20in%20Dalat%20Xuan%20Tho%20village%20large%20vegetable%20garden%20strawberry%20farm%20misty%20green%20hills%20peaceful%20rural%20life%20traditional%20Vietnamese%20architecture&width=1200&height=700&seq=r6&orientation=landscape',
      'https://readdy.ai/api/search-image?query=countryside%20farmhouse%20living%20room%20Dalat%20Xuan%20Tho%20rustic%20furniture%20simple%20comfortable%20earth%20tones%20large%20windows%20green%20hills%20view&width=1200&height=700&seq=r6b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bedroom%20farmhouse%20Dalat%20Xuan%20Tho%20simple%20clean%20bamboo%20headboard%20white%20curtains%20morning%20light%20greenery%20outside&width=1200&height=700&seq=r6c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=farm%20kitchen%20Dalat%20Xuan%20Tho%20large%20cooking%20space%20vegetable%20garden%20view%20traditional%20Vietnamese%20cooking%20corner%20bright%20clean&width=1200&height=700&seq=r6d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=strawberry%20garden%20Dalat%20Xuan%20Tho%20rows%20of%20strawberry%20plants%20red%20berries%20green%20leaves%20morning%20mist%20misty%20hills%20background&width=1200&height=700&seq=r6e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=vegetable%20garden%20Dalat%20Xuan%20Tho%20organic%20farm%20beds%20tomatoes%20herbs%20lettuce%20green%20rows%20country%20life%20morning%20dew&width=1200&height=700&seq=r6f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=front%20yard%20farm%20Dalat%20countryside%20gate%20stone%20path%20flowers%20trees%20hills%20background%20peaceful%20morning&width=1200&height=700&seq=r6g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=sunset%20countryside%20Dalat%20Xuan%20Tho%20farmhouse%20golden%20hour%20hills%20silhouette%20peaceful%20rural%20landscape%20dramatic%20sky&width=1200&height=700&seq=r6h&orientation=landscape',
    ],
  },

  // Căn 7 – Nhà phố hiện đại view đồi cà phê Phường 11
  7: {
    main: 'https://readdy.ai/api/search-image?query=modern%20Vietnamese%20house%20Dalat%20ward%2011%20hillside%20coffee%20plantation%20view%20misty%20hills%20contemporary%20design%20large%20windows%20bright%20facade%20green%20surroundings&width=800&height=500&seq=r7&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=modern%20Vietnamese%20house%20Dalat%20ward%2011%20hillside%20coffee%20plantation%20view%20misty%20hills%20contemporary%20design%20large%20windows%20bright%20facade%20green%20surroundings&width=1200&height=700&seq=r7&orientation=landscape',
      'https://readdy.ai/api/search-image?query=open%20concept%20living%20dining%20modern%20house%20Dalat%20hill%20view%20floor%20to%20ceiling%20windows%20concrete%20floors%20minimalist%20design%20plants&width=1200&height=700&seq=r7b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=modern%20master%20bedroom%20Dalat%20hillside%20view%20wabi%20sabi%20style%20neutral%20tones%20linen%20bedding%20natural%20light%20warm%20ambiance&width=1200&height=700&seq=r7c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=scandinavian%20kitchen%20modern%20house%20Dalat%20white%20and%20wood%20palette%20breakfast%20island%20pendant%20lights%20herbs%20natural%20light&width=1200&height=700&seq=r7d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=modern%20bathroom%20house%20Dalat%20terrazzo%20tiles%20walk%20in%20shower%20double%20vanity%20matte%20black%20fixtures%20bright%20skylight&width=1200&height=700&seq=r7e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=coffee%20plantation%20view%20terrace%20Dalat%20morning%20mist%20green%20hills%20panoramic%20outdoor%20seating%20furniture%20cool%20breeze&width=1200&height=700&seq=r7f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cozy%20workspace%20study%20room%20Dalat%20hill%20view%20windows%20wooden%20desk%20bookshelf%20plants%20natural%20afternoon%20light%20productive&width=1200&height=700&seq=r7g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=night%20view%20modern%20house%20Dalat%20city%20lights%20twinkling%20in%20valley%20warm%20exterior%20lighting%20facade%20evening%20beautiful&width=1200&height=700&seq=r7h&orientation=landscape',
    ],
  },

  // Căn 8 – Biệt thự nhỏ vườn hoa khu Phường 4
  8: {
    main: 'https://readdy.ai/api/search-image?query=charming%20small%20villa%20Dalat%20ward%204%20flower%20garden%20dahlias%20roses%20hydrangeas%20French%20inspired%20architecture%20wrought%20iron%20gate%20misty%20tranquil%20neighborhood&width=800&height=500&seq=r8&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=charming%20small%20villa%20Dalat%20ward%204%20flower%20garden%20dahlias%20roses%20hydrangeas%20French%20inspired%20architecture%20wrought%20iron%20gate%20misty%20tranquil%20neighborhood&width=1200&height=700&seq=r8&orientation=landscape',
      'https://readdy.ai/api/search-image?query=elegant%20living%20room%20small%20villa%20Dalat%20classic%20furniture%20fireplace%20flower%20arrangement%20tall%20windows%20parquet%20floor%20warm&width=1200&height=700&seq=r8b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=romantic%20master%20bedroom%20villa%20Dalat%20floral%20wallpaper%20soft%20lighting%20king%20bed%20vanity%20table%20morning%20light%20garden%20view&width=1200&height=700&seq=r8c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=villa%20kitchen%20Dalat%20French%20country%20style%20terracotta%20tiles%20butcher%20block%20counter%20open%20shelves%20herbs%20dried%20flowers%20charm&width=1200&height=700&seq=r8d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=villa%20bathroom%20Dalat%20clawfoot%20tub%20mosaic%20floor%20pedestal%20sink%20ornate%20mirror%20window%20with%20flower%20pot%20romantic&width=1200&height=700&seq=r8e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=flower%20garden%20villa%20Dalat%20dahlias%20hydrangeas%20roses%20colourful%20beds%20gravel%20path%20garden%20bench%20misty%20morning%20tranquil&width=1200&height=700&seq=r8f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=guest%20bedroom%20villa%20Dalat%20twin%20beds%20floral%20bedding%20window%20view%20flowers%20cozy%20warm%20nostalgic&width=1200&height=700&seq=r8g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=outdoor%20patio%20villa%20Dalat%20wrought%20iron%20table%20chairs%20flower%20pots%20climbing%20roses%20brick%20wall%20afternoon%20tea%20setting&width=1200&height=700&seq=r8h&orientation=landscape',
    ],
  },

  // Căn 9 – Nhà gỗ thông view thung lũng Lạc Dương
  9: {
    main: 'https://readdy.ai/api/search-image?query=wooden%20house%20Lac%20Duong%20Dalat%20pine%20timber%20architecture%20valley%20view%20below%20misty%20mountains%20green%20slope%20large%20windows%20natural%20light%20countryside%20retreat&width=800&height=500&seq=r9&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=wooden%20house%20Lac%20Duong%20Dalat%20pine%20timber%20architecture%20valley%20view%20below%20misty%20mountains%20green%20slope%20large%20windows%20natural%20light%20countryside%20retreat&width=1200&height=700&seq=r9&orientation=landscape',
      'https://readdy.ai/api/search-image?query=wooden%20house%20interior%20Lac%20Duong%20Dalat%20high%20beam%20ceilings%20pine%20walls%20warm%20living%20room%20hammock%20reading%20nook%20valley%20view%20windows&width=1200&height=700&seq=r9b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=loft%20bedroom%20wooden%20house%20Dalat%20Lac%20Duong%20pine%20ceiling%20natural%20wood%20stairs%20morning%20mist%20view%20from%20bed%20romantic&width=1200&height=700&seq=r9c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=compact%20rustic%20kitchen%20wooden%20house%20Dalat%20Lac%20Duong%20wooden%20shelves%20hanging%20pots%20gas%20stove%20bright%20morning%20light%20herbs&width=1200&height=700&seq=r9d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=outdoor%20shower%20deck%20wooden%20house%20Dalat%20Lac%20Duong%20bamboo%20screen%20towel%20nature%20surrounding%20private%20fresh%20air&width=1200&height=700&seq=r9e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=wide%20wraparound%20deck%20wooden%20house%20Lac%20Duong%20panoramic%20valley%20view%20chairs%20coffee%20morning%20light%20pine%20forest%20below%20misty&width=1200&height=700&seq=r9f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=night%20fire%20pit%20wooden%20house%20Dalat%20Lac%20Duong%20starry%20sky%20outdoor%20seating%20logs%20burning%20countryside%20evening%20romantic&width=1200&height=700&seq=r9g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=sunrise%20valley%20wooden%20house%20Dalat%20Lac%20Duong%20golden%20light%20misty%20valley%20below%20pine%20trees%20silhouette%20dramatic%20morning&width=1200&height=700&seq=r9h&orientation=landscape',
    ],
  },
};

// ─────────────────────────────────────────
// HOMESTAY
// ─────────────────────────────────────────

export const homestayImages: Record<number, { main: string; gallery: string[] }> = {
  // Căn 101 – Đà Lạt Dreamy House
  101: {
    main: 'https://readdy.ai/api/search-image?query=dreamy%20romantic%20homestay%20in%20Dalat%20Vietnam%20lush%20green%20valley%20view%20glass%20windows%20bohemian%20decor%20flower%20garden%20comfortable%20living%20room%20cozy%20atmosphere%20fairy%20lights&width=800&height=500&seq=h1&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=dreamy%20romantic%20homestay%20in%20Dalat%20Vietnam%20lush%20green%20valley%20view%20glass%20windows%20bohemian%20decor%20flower%20garden%20comfortable%20living%20room%20cozy%20atmosphere%20fairy%20lights&width=1200&height=700&seq=h1&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bohemian%20living%20room%20Dalat%20homestay%20rattan%20furniture%20macrame%20hanging%20fairy%20lights%20indoor%20plants%20cozy%20eclectic%20valley%20view&width=1200&height=700&seq=h1b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=dreamy%20bedroom%20Dalat%20homestay%20canopy%20bed%20fairy%20lights%20floral%20bedding%20window%20valley%20view%20soft%20morning%20light%20romantic&width=1200&height=700&seq=h1c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=fully%20equipped%20kitchen%20Dalat%20homestay%20breakfast%20bar%20colorful%20tiles%20herbs%20morning%20coffee%20bread%20fresh%20flowers%20bright&width=1200&height=700&seq=h1d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bathroom%20Dalat%20dreamy%20homestay%20floral%20tiles%20clawfoot%20tub%20flower%20bouquet%20window%20natural%20light%20romantic&width=1200&height=700&seq=h1e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=flower%20garden%20Dalat%20dreamy%20homestay%20mimosa%20yellow%20blossoms%20colorful%20beds%20stone%20path%20morning%20fog%20valley%20below%20serene&width=1200&height=700&seq=h1f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=BBQ%20outdoor%20area%20Dalat%20homestay%20fairy%20lights%20string%20lights%20evening%20gathering%20picnic%20table%20fire%20pit%20cozy&width=1200&height=700&seq=h1g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=second%20floor%20bedroom%20Dalat%20dreamy%20homestay%20window%20seat%20valley%20view%20twin%20beds%20plaid%20blanket%20afternoon%20sunlight&width=1200&height=700&seq=h1h&orientation=landscape',
    ],
  },

  // Căn 102 – Pine Hill Retreat
  102: {
    main: 'https://readdy.ai/api/search-image?query=cozy%20pine%20tree%20forest%20retreat%20homestay%20in%20Dalat%20wooden%20interior%20warm%20fireplace%20large%20windows%20overlooking%20pine%20forest%20rustic%20mountain%20lodge%20atmosphere&width=800&height=500&seq=h2&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=cozy%20pine%20tree%20forest%20retreat%20homestay%20in%20Dalat%20wooden%20interior%20warm%20fireplace%20large%20windows%20overlooking%20pine%20forest%20rustic%20mountain%20lodge%20atmosphere&width=1200&height=700&seq=h2&orientation=landscape',
      'https://readdy.ai/api/search-image?query=mountain%20lodge%20living%20room%20Dalat%20pine%20walls%20stone%20fireplace%20roaring%20fire%20cozy%20sofa%20fur%20throw%20rug%20warm%20evening&width=1200&height=700&seq=h2b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=pine%20forest%20bedroom%20retreat%20Dalat%20wooden%20ceiling%20exposed%20beams%20white%20bedding%20pine%20trees%20framed%20in%20window%20serene&width=1200&height=700&seq=h2c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=rustic%20kitchen%20mountain%20retreat%20Dalat%20pine%20wood%20farm%20table%20open%20shelves%20cast%20iron%20pans%20morning%20light%20herbs&width=1200&height=700&seq=h2d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=natural%20stone%20bathroom%20mountain%20retreat%20Dalat%20pebble%20tiles%20rain%20shower%20bamboo%20towel%20rack%20window%20pine%20forest%20view&width=1200&height=700&seq=h2e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=small%20swimming%20pool%20pine%20forest%20Dalat%20crystal%20water%20surrounded%20by%20trees%20deck%20chairs%20umbrella%20misty%20morning&width=1200&height=700&seq=h2f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=yoga%20deck%20pine%20forest%20Dalat%20outdoor%20wooden%20platform%20morning%20mist%20meditation%20space%20trees%20surrounding%20peaceful&width=1200&height=700&seq=h2g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=BBQ%20evening%20pine%20forest%20Dalat%20retreat%20outdoor%20grill%20fire%20stars%20sky%20gathering%20wooden%20benches%20cozy%20atmosphere&width=1200&height=700&seq=h2i&orientation=landscape',
    ],
  },

  // Căn 103 – Đà Lạt Rose Cottage
  103: {
    main: 'https://readdy.ai/api/search-image?query=charming%20rose%20cottage%20homestay%20in%20Dalat%20Vietnam%20beautiful%20rose%20garden%20English%20cottage%20style%20colorful%20flowers%20romantic%20setting%20fairy%20tale%20atmosphere%20misty%20morning&width=800&height=500&seq=h3&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=charming%20rose%20cottage%20homestay%20in%20Dalat%20Vietnam%20beautiful%20rose%20garden%20English%20cottage%20style%20colorful%20flowers%20romantic%20setting%20fairy%20tale%20atmosphere%20misty%20morning&width=1200&height=700&seq=h3&orientation=landscape',
      'https://readdy.ai/api/search-image?query=rose%20cottage%20interior%20Dalat%20floral%20cushions%20warm%20colour%20living%20room%20window%20rose%20garden%20view%20lace%20curtains%20nostalgic%20romantic&width=1200&height=700&seq=h3b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=romantic%20bedroom%20rose%20cottage%20Dalat%20white%20iron%20bed%20rose%20bouquet%20vanity%20window%20seat%20morning%20light%20soft%20feminine&width=1200&height=700&seq=h3c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cottage%20kitchen%20Dalat%20pastel%20colours%20floral%20china%20open%20shelves%20window%20herbs%20flower%20pots%20afternoon%20light%20charming&width=1200&height=700&seq=h3d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cottage%20bathroom%20Dalat%20rose%20petals%20bathtub%20tiles%20with%20floral%20pattern%20mirror%20flowers%20candles%20romantic%20spa%20feel&width=1200&height=700&seq=h3e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=rose%20garden%20Dalat%20cottage%20200%20roses%20red%20pink%20white%20blooms%20climbing%20arch%20dew%20morning%20mist%20fog%20romantic&width=1200&height=700&seq=h3f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bicycles%20rose%20cottage%20Dalat%20colourful%20vintage%20bicycles%20leaning%20against%20flower%20wall%20garden%20gate%20morning&width=1200&height=700&seq=h3g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=outdoor%20seating%20rose%20cottage%20Dalat%20garden%20table%20chairs%20tea%20set%20flowers%20surrounding%20afternoon%20peaceful%20tea%20time&width=1200&height=700&seq=h3h&orientation=landscape',
    ],
  },

  // Căn 104 – Lakeside Cabin
  104: {
    main: 'https://readdy.ai/api/search-image?query=luxury%20lakeside%20cabin%20homestay%20Dalat%20Xuan%20Huong%20lake%20view%20panoramic%20windows%20modern%20interior%20dawn%20mist%20on%20water%20reflection%20mountains%20premium%20accommodation&width=800&height=500&seq=h4&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=luxury%20lakeside%20cabin%20homestay%20Dalat%20Xuan%20Huong%20lake%20view%20panoramic%20windows%20modern%20interior%20dawn%20mist%20on%20water%20reflection%20mountains%20premium%20accommodation&width=1200&height=700&seq=h4&orientation=landscape',
      'https://readdy.ai/api/search-image?query=luxury%20living%20room%20lakeside%20cabin%20Dalat%20panoramic%20floor%20to%20ceiling%20windows%20Xuan%20Huong%20lake%20view%20contemporary%20furniture%20morning%20mist&width=1200&height=700&seq=h4b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=premium%20master%20bedroom%20lakeside%20cabin%20Dalat%20lake%20view%20floor%20to%20ceiling%20glass%20balcony%20door%20white%20bedding%20dawn%20misty%20water&width=1200&height=700&seq=h4c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=gourmet%20kitchen%20lakeside%20cabin%20Dalat%20marble%20island%20coffee%20bar%20lake%20view%20window%20modern%20design%20premium%20finishes&width=1200&height=700&seq=h4d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=Jacuzzi%20bathroom%20lakeside%20cabin%20Dalat%20lake%20view%20large%20tub%20marble%20tiles%20double%20vanity%20soft%20lighting%20premium%20spa&width=1200&height=700&seq=h4e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=balcony%20lakeside%20cabin%20Dalat%20Xuan%20Huong%20lake%20panorama%20morning%20coffee%20outdoor%20chairs%20sunrise%20reflection%20calm%20water&width=1200&height=700&seq=h4f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=evening%20lakeside%20cabin%20Dalat%20lake%20reflections%20city%20lights%20twinkling%20water%20calm%20warm%20exterior%20lights%20romantic&width=1200&height=700&seq=h4g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=guest%20bedroom%20lakeside%20cabin%20Dalat%20lake%20partial%20view%20queen%20bed%20minimalist%20white%20fresh%20flowers%20bedside%20lamp%20serene&width=1200&height=700&seq=h4h&orientation=landscape',
    ],
  },

  // Căn 105 – Strawberry Farm Stay
  105: {
    main: 'https://readdy.ai/api/search-image?query=strawberry%20farm%20homestay%20in%20Dalat%20Xuan%20Tho%20red%20strawberries%20garden%20rows%20of%20strawberry%20plants%20cozy%20farmhouse%20misty%20green%20hills%20agricultural%20countryside%20experience&width=800&height=500&seq=h5&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=strawberry%20farm%20homestay%20in%20Dalat%20Xuan%20Tho%20red%20strawberries%20garden%20rows%20of%20strawberry%20plants%20cozy%20farmhouse%20misty%20green%20hills%20agricultural%20countryside%20experience&width=1200&height=700&seq=h5&orientation=landscape',
      'https://readdy.ai/api/search-image?query=farmhouse%20living%20room%20Dalat%20Xuan%20Tho%20rustic%20charm%20exposed%20wood%20walls%20plaid%20sofa%20strawberry%20jam%20jars%20shelf%20morning%20light&width=1200&height=700&seq=h5b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=farm%20bedroom%20Dalat%20cozy%20country%20style%20wooden%20walls%20white%20linen%20hay%20bale%20inspired%20headboard%20window%20green%20farm%20view&width=1200&height=700&seq=h5c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=farm%20kitchen%20Dalat%20Xuan%20Tho%20strawberry%20jam%20making%20rustic%20wooden%20table%20fresh%20picked%20berries%20country%20cooking%20morning&width=1200&height=700&seq=h5d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=strawberry%20picking%20Dalat%20Xuan%20Tho%20red%20ripe%20strawberries%20rows%20green%20leaves%20hands%20picking%20fresh%20dew%20morning%20activity&width=1200&height=700&seq=h5e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=strawberry%20farm%20panorama%20Dalat%20Xuan%20Tho%20green%20rows%20red%20berries%20misty%20hills%20in%20background%20morning%20light%20fresh%20air&width=1200&height=700&seq=h5f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cooking%20class%20farmhouse%20Dalat%20Xuan%20Tho%20jam%20making%20fresh%20strawberry%20cake%20flour%20kitchen%20table%20local%20ingredients&width=1200&height=700&seq=h5g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=farm%20bicycle%20Dalat%20Xuan%20Tho%20countryside%20road%20green%20fields%20morning%20ride%20fresh%20air%20misty%20morning%20rural%20charm&width=1200&height=700&seq=h5h&orientation=landscape',
    ],
  },

  // Căn 106 – Fog & Forest Lodge
  106: {
    main: 'https://readdy.ai/api/search-image?query=mountain%20forest%20lodge%20in%20Lac%20Duong%20Dalat%20panoramic%20view%20of%20pine%20covered%20hills%20fog%20rolling%20in%20valleys%20luxury%20wooden%20lodge%20stone%20fireplace%20dramatic%20scenery&width=800&height=500&seq=h6&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=mountain%20forest%20lodge%20in%20Lac%20Duong%20Dalat%20panoramic%20view%20of%20pine%20covered%20hills%20fog%20rolling%20in%20valleys%20luxury%20wooden%20lodge%20stone%20fireplace%20dramatic%20scenery&width=1200&height=700&seq=h6&orientation=landscape',
      'https://readdy.ai/api/search-image?query=grand%20hall%20mountain%20lodge%20Dalat%20Lac%20Duong%20high%20vaulted%20ceiling%20stone%20fireplace%20moose%20skull%20mount%20wooden%20beams%20warm%20cozy&width=1200&height=700&seq=h6b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=mountain%20lodge%20master%20bedroom%20Dalat%20pine%20forest%20panorama%20four%20poster%20bed%20luxury%20linen%20panoramic%20window%20dawn%20light&width=1200&height=700&seq=h6c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=lodge%20kitchen%20Dalat%20Lac%20Duong%20large%20island%20granite%20counter%20professional%20range%20hood%20storage%20abundant%20morning%20prep%20light&width=1200&height=700&seq=h6d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=lodge%20bathroom%20Dalat%20soaking%20tub%20mountain%20view%20mosaic%20tiles%20heated%20floors%20double%20vanity%20spa%20towels%20premium&width=1200&height=700&seq=h6e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=games%20room%20lodge%20Dalat%20Lac%20Duong%20billiards%20pool%20table%20board%20games%20bar%20cabinet%20wood%20paneling%20warm%20evening%20fun&width=1200&height=700&seq=h6f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=rooftop%20deck%20mountain%20lodge%20Dalat%20Lac%20Duong%20360%20panorama%20pine%20mountains%20fog%20sunset%20dramatic%20sky%20chairs%20blankets&width=1200&height=700&seq=h6g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=foggy%20morning%20mountain%20lodge%20Dalat%20Lac%20Duong%20mist%20rolling%20valley%20pine%20forest%20ethereal%20mystical%20landscape%20sunrise&width=1200&height=700&seq=h6h&orientation=landscape',
    ],
  },

  // Căn 107 – Lavender Dream
  107: {
    main: 'https://readdy.ai/api/search-image?query=beautiful%20lavender%20themed%20homestay%20Dalat%20ward%206%20purple%20flower%20garden%20Provence%20style%20house%20white%20walls%20lavender%20field%20morning%20mist%20romantic%20Dalat&width=800&height=500&seq=h7&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=beautiful%20lavender%20themed%20homestay%20Dalat%20ward%206%20purple%20flower%20garden%20Provence%20style%20house%20white%20walls%20lavender%20field%20morning%20mist%20romantic%20Dalat&width=1200&height=700&seq=h7&orientation=landscape',
      'https://readdy.ai/api/search-image?query=Provence%20style%20living%20room%20Dalat%20lavender%20purple%20accents%20linen%20sofas%20dried%20lavender%20bundles%20window%20garden%20view%20warm&width=1200&height=700&seq=h7b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bedroom%20lavender%20homestay%20Dalat%20white%20iron%20bed%20purple%20bedding%20lavender%20sachets%20window%20morning%20light%20soft%20romantic&width=1200&height=700&seq=h7c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=French%20country%20kitchen%20Dalat%20lavender%20homestay%20blue%20tiles%20herbs%20bundles%20window%20lavender%20garden%20view%20pastels%20bright&width=1200&height=700&seq=h7d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=spa%20bathroom%20lavender%20homestay%20Dalat%20lavender%20bath%20salts%20clawfoot%20tub%20purple%20accents%20candles%20flowers%20serene&width=1200&height=700&seq=h7e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=lavender%20garden%20Dalat%20homestay%20rows%20purple%20lavender%20flowers%20morning%20mist%20Provence%20feel%20guests%20walking%20path%20romantic&width=1200&height=700&seq=h7f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=outdoor%20breakfast%20table%20Dalat%20lavender%20homestay%20garden%20morning%20coffee%20croissant%20lavender%20honey%20fresh%20flowers%20table%20setting&width=1200&height=700&seq=h7g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=sunset%20lavender%20field%20Dalat%20golden%20hour%20purple%20flowers%20glowing%20warm%20sky%20romantic%20dramatic%20silhouettes&width=1200&height=700&seq=h7h&orientation=landscape',
    ],
  },

  // Căn 108 – Treehouse Retreat
  108: {
    main: 'https://readdy.ai/api/search-image?query=magical%20treehouse%20retreat%20Dalat%20Xuan%20Tho%20wooden%20tree%20house%20elevated%20in%20pine%20trees%20suspension%20bridge%20fairy%20lights%20green%20canopy%20adventurous%20unique%20stay&width=800&height=500&seq=h8&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=magical%20treehouse%20retreat%20Dalat%20Xuan%20Tho%20wooden%20tree%20house%20elevated%20in%20pine%20trees%20suspension%20bridge%20fairy%20lights%20green%20canopy%20adventurous%20unique%20stay&width=1200&height=700&seq=h8&orientation=landscape',
      'https://readdy.ai/api/search-image?query=treehouse%20interior%20Dalat%20living%20area%20circular%20windows%20tree%20canopy%20view%20circular%20sofa%20fairy%20lights%20warm%20cozy%20wood%20walls&width=1200&height=700&seq=h8b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=treehouse%20bedroom%20Dalat%20elevated%20among%20trees%20round%20porthole%20windows%20loft%20bed%20rope%20ladder%20white%20linen%20morning%20forest%20light&width=1200&height=700&seq=h8c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=treehouse%20kitchen%20Dalat%20compact%20kitchenette%20wood%20counter%20morning%20breakfast%20among%20trees%20canopy%20view%20coffee%20percolator%20bright&width=1200&height=700&seq=h8d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=treehouse%20deck%20Dalat%20canopy%20level%20morning%20mist%20tree%20tops%20hanging%20chairs%20birds%20view%20suspension%20walkway%20green%20forest&width=1200&height=700&seq=h8e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=rope%20bridge%20treehouse%20Dalat%20Xuan%20Tho%20suspension%20walkway%20between%20trees%20aerial%20view%20canopy%20adventure%20romantic%20magical&width=1200&height=700&seq=h8f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=treehouse%20night%20Dalat%20fairy%20lights%20glow%20forest%20evening%20stars%20canopy%20magical%20warm%20golden%20windows%20trees%20silhouette&width=1200&height=700&seq=h8g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=forest%20floor%20view%20from%20treehouse%20Dalat%20Xuan%20Tho%20looking%20down%20green%20carpet%20moss%20ferns%20sunlight%20streaming%20through%20canopy&width=1200&height=700&seq=h8h&orientation=landscape',
    ],
  },

  // Căn 109 – Misty Mountain Chalet
  109: {
    main: 'https://readdy.ai/api/search-image?query=alpine%20chalet%20Ta%20Nung%20Dalat%20highlands%20stone%20wood%20architecture%20misty%20mountain%20panorama%20surrounded%20by%20pine%20forest%20dramatic%20clouds%20luxury%20mountain%20retreat&width=800&height=500&seq=h9&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=alpine%20chalet%20Ta%20Nung%20Dalat%20highlands%20stone%20wood%20architecture%20misty%20mountain%20panorama%20surrounded%20by%20pine%20forest%20dramatic%20clouds%20luxury%20mountain%20retreat&width=1200&height=700&seq=h9&orientation=landscape',
      'https://readdy.ai/api/search-image?query=alpine%20chalet%20living%20room%20Dalat%20Ta%20Nung%20stone%20fireplace%20roaring%20fire%20moose%20antler%20wall%20art%20cozy%20plaid%20sofas%20mountain%20view%20window&width=1200&height=700&seq=h9b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=chalet%20master%20bedroom%20Dalat%20highlands%20panoramic%20mountain%20view%20sloped%20wooden%20ceiling%20king%20bed%20white%20fur%20throw%20dramatic%20morning%20mist&width=1200&height=700&seq=h9c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=mountain%20chalet%20kitchen%20Dalat%20Aga%20range%20cooker%20stone%20wall%20farmhouse%20sink%20wooden%20beam%20ceiling%20hanging%20copper%20pots%20rustic%20luxury&width=1200&height=700&seq=h9d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=chalet%20bathroom%20Dalat%20Ta%20Nung%20deep%20soaking%20tub%20stone%20wall%20mountain%20view%20window%20towel%20warmer%20luxury%20rustic&width=1200&height=700&seq=h9e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=chalet%20terrace%20Dalat%20Ta%20Nung%20mountain%20panorama%20mist%20pine%20forest%20deck%20chairs%20blankets%20hot%20cocoa%20dramatic%20sky%20morning&width=1200&height=700&seq=h9f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=chalet%20outdoor%20hot%20tub%20Dalat%20Ta%20Nung%20steam%20rising%20pine%20forest%20misty%20mountain%20evening%20stars%20romantic%20soak%20luxury&width=1200&height=700&seq=h9g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=mountain%20sunrise%20Ta%20Nung%20Dalat%20dramatic%20red%20orange%20sky%20misty%20pine%20forest%20silhouette%20chalet%20rooftop%20view%20breathtaking&width=1200&height=700&seq=h9i&orientation=landscape',
    ],
  },
};

// ─────────────────────────────────────────
// CĂN HỘ (apartment)
// ─────────────────────────────────────────

export const apartmentImages: Record<number, { main: string; gallery: string[] }> = {
  // Căn 201 – Căn hộ cao cấp Đà Lạt Center
  201: {
    main: 'https://readdy.ai/api/search-image?query=luxury%20modern%20apartment%20building%20in%20Dalat%20city%20center%20high%20rise%20panoramic%20city%20view%20mountains%20in%20background%20contemporary%20architecture%20glass%20facade%20urban%20living&width=800&height=500&seq=a1&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=luxury%20modern%20apartment%20building%20in%20Dalat%20city%20center%20high%20rise%20panoramic%20city%20view%20mountains%20in%20background%20contemporary%20architecture%20glass%20facade%20urban%20living&width=1200&height=700&seq=a1&orientation=landscape',
      'https://readdy.ai/api/search-image?query=luxury%20apartment%20living%20room%20Dalat%20floor%20to%20ceiling%20windows%20city%20panorama%20modern%20Italian%20furniture%20marble%20coffee%20table&width=1200&height=700&seq=a1b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=master%20bedroom%20luxury%20apartment%20Dalat%20city%20view%20walk%20in%20closet%20premium%20bedding%20en-suite%20bathroom%20minimalist%20modern&width=1200&height=700&seq=a1c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=gourmet%20kitchen%20luxury%20apartment%20Dalat%20marble%20island%20Miele%20appliances%20wine%20cooler%20city%20view%20peninsula%20design%20premium&width=1200&height=700&seq=a1d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=master%20bathroom%20luxury%20apartment%20Dalat%20double%20vanity%20freestanding%20tub%20city%20view%20window%20marble%20floors%20premium%20fixtures&width=1200&height=700&seq=a1e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=infinity%20pool%20luxury%20apartment%20complex%20Dalat%20rooftop%20city%20mountain%20panorama%20swimmers%20evening%20cityscape%20reflection&width=1200&height=700&seq=a1f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=gym%20facility%20apartment%20complex%20Dalat%20modern%20equipment%20floor%20to%20ceiling%20glass%20city%20view%20morning%20workout&width=1200&height=700&seq=a1g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=city%20panorama%20from%20balcony%20apartment%20Dalat%20night%20city%20lights%20mountains%20silhouette%20urban%20sophisticated%20evening%20dramatic&width=1200&height=700&seq=a1h&orientation=landscape',
    ],
  },

  // Căn 202 – Căn hộ 2PN view Hồ Xuân Hương
  202: {
    main: 'https://readdy.ai/api/search-image?query=beautiful%20apartment%20overlooking%20Xuan%20Huong%20lake%20Dalat%20Vietnam%20modern%20interior%20balcony%20with%20lake%20view%20sunrise%20reflection%20on%20water%20residential%20building&width=800&height=500&seq=a2&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=beautiful%20apartment%20overlooking%20Xuan%20Huong%20lake%20Dalat%20Vietnam%20modern%20interior%20balcony%20with%20lake%20view%20sunrise%20reflection%20on%20water%20residential%20building&width=1200&height=700&seq=a2&orientation=landscape',
      'https://readdy.ai/api/search-image?query=apartment%20living%20room%20Xuan%20Huong%20lake%20view%20Dalat%20morning%20mist%20reflection%20on%20water%20cozy%20sofa%20Scandinavian%20design%20warm&width=1200&height=700&seq=a2b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=master%20bedroom%20apartment%20Dalat%20lake%20view%20king%20bed%20white%20linen%20window%20seat%20morning%20light%20tranquil%20calm%20water%20visible&width=1200&height=700&seq=a2c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=kitchen%20apartment%20Dalat%20lake%20view%20modern%20light%20wood%20white%20cabinet%20breakfast%20bar%20window%20lake%20morning%20fresh&width=1200&height=700&seq=a2d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bathroom%20apartment%20Dalat%20modern%20freestanding%20tub%20lake%20view%20window%20white%20tiles%20luxurious%20calm%20morning%20light&width=1200&height=700&seq=a2e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=balcony%20apartment%20Xuan%20Huong%20lake%20Dalat%20morning%20coffee%20chairs%20lake%20panorama%20mist%20reflection%20boats%20swan&width=1200&height=700&seq=a2f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=apartment%20building%20exterior%20Dalat%20Xuan%20Huong%20lake%20front%20residential%20elegant%20facade%20garden%20lobby%20entrance&width=1200&height=700&seq=a2g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=sunset%20lake%20view%20apartment%20Dalat%20Xuan%20Huong%20golden%20reflections%20dramatic%20sky%20evening%20silhouette%20romantic&width=1200&height=700&seq=a2h&orientation=landscape',
    ],
  },

  // Căn 203 – Studio hiện đại
  203: {
    main: 'https://readdy.ai/api/search-image?query=modern%20studio%20apartment%20in%20Dalat%20Vietnam%20minimalist%20interior%20design%20cozy%20living%20space%20city%20view%20compact%20efficient%20layout%20white%20walls%20wood%20accents&width=800&height=500&seq=a3&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=modern%20studio%20apartment%20in%20Dalat%20Vietnam%20minimalist%20interior%20design%20cozy%20living%20space%20city%20view%20compact%20efficient%20layout%20white%20walls%20wood%20accents&width=1200&height=700&seq=a3&orientation=landscape',
      'https://readdy.ai/api/search-image?query=studio%20apartment%20open%20plan%20Dalat%20minimalist%20white%20walls%20warm%20wood%20sofa%20bed%20combo%20city%20view%20window%20plants%20efficient%20use%20space&width=1200&height=700&seq=a3b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=studio%20apartment%20sleeping%20area%20Dalat%20built%20in%20storage%20wall%20murphy%20bed%20folded%20up%20bright%20day%20light%20compact%20clean&width=1200&height=700&seq=a3c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=studio%20apartment%20kitchen%20Dalat%20compact%20kitchenette%20white%20gloss%20linear%20wall%20unit%20coffee%20machine%20small%20bar%20morning&width=1200&height=700&seq=a3d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=studio%20apartment%20bathroom%20Dalat%20compact%20walk%20in%20shower%20white%20tiles%20chrome%20accents%20mirror%20bright%20clean%20modern&width=1200&height=700&seq=a3e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=studio%20apartment%20window%20view%20Dalat%20city%20center%20rooftops%20pine%20trees%20distant%20mountains%20morning%20fresh%20light%20clean&width=1200&height=700&seq=a3f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=apartment%20building%20lobby%20Dalat%20modern%20reception%20polished%20floor%20concierge%20desk%20elevator%20hall%20clean%20bright&width=1200&height=700&seq=a3g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=studio%20apartment%20night%20light%20Dalat%20city%20glow%20ambient%20lighting%20warm%20cozy%20window%20urban%20evening%20comfortable&width=1200&height=700&seq=a3h&orientation=landscape',
    ],
  },

  // Căn 204 – Penthouse 360°
  204: {
    main: 'https://readdy.ai/api/search-image?query=luxurious%20penthouse%20apartment%20in%20Dalat%20360%20degree%20mountain%20view%20pine%20forest%20panorama%20rooftop%20terrace%20high%20end%20interior%20design%20elegant%20living%20room%20fireplace&width=800&height=500&seq=a4&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=luxurious%20penthouse%20apartment%20in%20Dalat%20360%20degree%20mountain%20view%20pine%20forest%20panorama%20rooftop%20terrace%20high%20end%20interior%20design%20elegant%20living%20room%20fireplace&width=1200&height=700&seq=a4&orientation=landscape',
      'https://readdy.ai/api/search-image?query=penthouse%20living%20room%20Dalat%20360%20view%20wraparound%20windows%20furniture%20luxury%20fireplace%20art%20piece%20high%20ceiling%20sophisticated&width=1200&height=700&seq=a4b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=penthouse%20master%20bedroom%20Dalat%20mountain%20panorama%20sunrise%20bespoke%20wardrobe%20king%20bed%20premium%20bedding%20en%20suite%20dressing%20room&width=1200&height=700&seq=a4c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=penthouse%20kitchen%20Dalat%20chef%20grade%20range%20custom%20cabinetry%20marble%20waterfall%20island%20wine%20fridge%20panoramic%20view%20luxury&width=1200&height=700&seq=a4d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=penthouse%20master%20bath%20Dalat%20freestanding%20tub%20mountain%20view%20panoramic%20window%20heated%20floor%20double%20vanity%20walk%20in%20shower%20luxury&width=1200&height=700&seq=a4e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=penthouse%20private%20rooftop%20terrace%20Dalat%20360%20mountain%20view%20infinity%20edge%20pool%20sun%20loungers%20outdoor%20dining%20evening%20sky&width=1200&height=700&seq=a4f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=penthouse%20home%20theater%20Dalat%20media%20room%20large%20screen%20luxury%20seating%20ambient%20lighting%20soundproofed%20interior%20premium&width=1200&height=700&seq=a4g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=penthouse%20terrace%20night%20Dalat%20city%20lights%20mountain%20silhouette%20stars%20sky%20360%20panorama%20champagne%20table%20romantic&width=1200&height=700&seq=a4i&orientation=landscape',
    ],
  },

  // Căn 205 – Đà Lạt Green Complex
  205: {
    main: 'https://readdy.ai/api/search-image?query=residential%20complex%20apartment%20in%20Dalat%20green%20surroundings%20family%20friendly%20modern%20building%20landscaped%20gardens%20children%20playground%20community%20living&width=800&height=500&seq=a5&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=residential%20complex%20apartment%20in%20Dalat%20green%20surroundings%20family%20friendly%20modern%20building%20landscaped%20gardens%20children%20playground%20community%20living&width=1200&height=700&seq=a5&orientation=landscape',
      'https://readdy.ai/api/search-image?query=family%20apartment%20living%20room%20Dalat%20Green%20complex%20warm%20sofa%20kids%20corner%20TV%20accent%20wall%20garden%20view%20bright%20family%20friendly&width=1200&height=700&seq=a5b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=family%20apartment%20master%20bedroom%20Dalat%20Green%20complex%20calming%20colours%20built%20in%20wardrobe%20balcony%20garden%20view%20morning%20light&width=1200&height=700&seq=a5c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=functional%20family%20kitchen%20Dalat%20apartment%20large%20storage%20island%20breakfast%20bar%20wide%20window%20overlooking%20playground%20gardens&width=1200&height=700&seq=a5d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=family%20bathroom%20apartment%20Dalat%20Green%20complex%20full%20size%20tub%20separate%20shower%20dual%20sinks%20family%20practical%20bright&width=1200&height=700&seq=a5e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=children%20playground%20complex%20Dalat%20Green%20landscaped%20gardens%20safe%20equipment%20colourful%20afternoon%20children%20playing%20community&width=1200&height=700&seq=a5f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=community%20swimming%20pool%20Dalat%20Green%20complex%20family%20friendly%20afternoon%20sun%20surrounded%20by%20gardens%20landscaping%20trees&width=1200&height=700&seq=a5g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=tennis%20court%20complex%20Dalat%20Green%20afternoon%20match%20well%20maintained%20floodlights%20mountain%20backdrop%20community%20sport&width=1200&height=700&seq=a5h&orientation=landscape',
    ],
  },

  // Căn 206 – Duplex rừng thông Phường 9
  206: {
    main: 'https://readdy.ai/api/search-image?query=duplex%20apartment%20overlooking%20pine%20forest%20in%20Dalat%20Vietnam%20double%20height%20living%20room%20glass%20walls%20modern%20architecture%20natural%20light%20green%20views&width=800&height=500&seq=a6&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=duplex%20apartment%20overlooking%20pine%20forest%20in%20Dalat%20Vietnam%20double%20height%20living%20room%20glass%20walls%20modern%20architecture%20natural%20light%20green%20views&width=1200&height=700&seq=a6&orientation=landscape',
      'https://readdy.ai/api/search-image?query=duplex%20double%20height%20living%20room%20Dalat%20pine%20forest%20view%20void%20space%20staircase%20glass%20railing%20pendant%20lights%20modern&width=1200&height=700&seq=a6b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=duplex%20master%20bedroom%20upper%20level%20Dalat%20pine%20forest%20view%20mezzanine%20exposed%20concrete%20beam%20industrial%20modern%20linen&width=1200&height=700&seq=a6c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=duplex%20kitchen%20lower%20level%20Dalat%20open%20plan%20concrete%20floor%20industrial%20shelving%20pine%20forest%20window%20view%20island&width=1200&height=700&seq=a6d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=duplex%20bathroom%20Dalat%20concrete%20walls%20freestanding%20tub%20pine%20forest%20window%20wet%20room%20floor%20drain%20industrial%20luxury&width=1200&height=700&seq=a6e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=apartment%20shared%20garden%20Dalat%20pine%20forest%20lower%20level%20outdoor%20seating%20landscaped%20grounds%20communal%20space%20tranquil&width=1200&height=700&seq=a6f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=duplex%20spiral%20staircase%20Dalat%20architectural%20feature%20steel%20glass%20steps%20upper%20lower%20level%20light%20design%20statement&width=1200&height=700&seq=a6g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=duplex%20evening%20interior%20Dalat%20warm%20lights%20pine%20forest%20dark%20outside%20living%20room%20fire%20place%20reading%20evening%20cozy&width=1200&height=700&seq=a6h&orientation=landscape',
    ],
  },

  // Căn 207 – Khu đô thị mới Phường 10
  207: {
    main: 'https://readdy.ai/api/search-image?query=new%20urban%20apartment%20building%20Dalat%20ward%2010%20modern%20contemporary%20architecture%20clean%20lines%20landscaped%20approach%20mountain%20backdrop%20residential%20investment%20property&width=800&height=500&seq=a7&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=new%20urban%20apartment%20building%20Dalat%20ward%2010%20modern%20contemporary%20architecture%20clean%20lines%20landscaped%20approach%20mountain%20backdrop%20residential%20investment%20property&width=1200&height=700&seq=a7&orientation=landscape',
      'https://readdy.ai/api/search-image?query=modern%20apartment%20living%20room%20Dalat%20ward%2010%20city%20views%20clean%20lines%20neutral%20palette%20sofa%20plants%20wood%20floor%20balcony&width=1200&height=700&seq=a7b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=master%20bedroom%20new%20apartment%20Dalat%20soft%20grey%20walls%20floating%20nightstands%20LED%20accent%20lighting%20mountain%20view%20window%20built%20in%20wardrobe&width=1200&height=700&seq=a7c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=kitchen%20apartment%20Dalat%20ward%2010%20handleless%20cabinets%20quartz%20countertop%20gas%20hob%20extractor%20fan%20morning%20light%20window%20city&width=1200&height=700&seq=a7d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bathroom%20apartment%20Dalat%20ward%2010%20large%20format%20tiles%20glass%20partition%20shower%20double%20basin%20vanity%20chrome%20fittings%20bright&width=1200&height=700&seq=a7e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=balcony%20apartment%20Dalat%20ward%2010%20mountain%20view%20morning%20light%20potted%20plants%20outdoor%20chairs%20fresh%20air%20city%20landscape&width=1200&height=700&seq=a7f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=apartment%20complex%20Dalat%20ward%2010%20communal%20garden%20seating%20area%20residents%20socialising%20evening%20BBQ%20landscaped%20modern&width=1200&height=700&seq=a7g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=apartment%20security%20lobby%20Dalat%20modern%20concierge%20parcel%20storage%20locker%20mailbox%20clean%20bright%20contemporary%20entrance&width=1200&height=700&seq=a7h&orientation=landscape',
    ],
  },

  // Căn 208 – Officetel thông minh
  208: {
    main: 'https://readdy.ai/api/search-image?query=smart%20officetel%20apartment%20Dalat%20city%20centre%20flexible%20live%20work%20space%20modern%20ergonomic%20design%20tech%20enabled%20contemporary%20building%20executive&width=800&height=500&seq=a8&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=smart%20officetel%20apartment%20Dalat%20city%20centre%20flexible%20live%20work%20space%20modern%20ergonomic%20design%20tech%20enabled%20contemporary%20building%20executive&width=1200&height=700&seq=a8&orientation=landscape',
      'https://readdy.ai/api/search-image?query=officetel%20open%20plan%20live%20work%20Dalat%20modern%20dual%20purpose%20furniture%20smart%20storage%20hidden%20bed%20city%20view%20window%20clean%20design&width=1200&height=700&seq=a8b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=home%20office%20area%20officetel%20Dalat%20standing%20desk%20ergonomic%20chair%20monitor%20display%20city%20view%20window%20afternoon%20light%20productive&width=1200&height=700&seq=a8c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=sleeping%20zone%20officetel%20Dalat%20hidden%20Murphy%20wall%20bed%20closed%20day%20folded%20neatly%20smart%20design%20minimalist%20modern&width=1200&height=700&seq=a8d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=modern%20kitchenette%20officetel%20Dalat%20compact%20smart%20appliances%20espresso%20bar%20microwave%20minimalist%20bright%20morning%20clean&width=1200&height=700&seq=a8e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=bathroom%20officetel%20Dalat%20walk%20in%20shower%20glass%20screen%20large%20mirror%20vanity%20functional%20bright%20clean%20modern&width=1200&height=700&seq=a8f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=coworking%20lounge%20officetel%20building%20Dalat%20residents%20working%20networking%20coffee%20machines%20communal%20tables%20modern%20tech&width=1200&height=700&seq=a8g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=city%20view%20officetel%20Dalat%20city%20centre%20window%20night%20lights%20twinkling%20skyline%20urban%20living%20productive%20evening&width=1200&height=700&seq=a8h&orientation=landscape',
    ],
  },

  // Căn 209 – Căn hộ 4PN Nam Ban
  209: {
    main: 'https://readdy.ai/api/search-image?query=large%20family%20apartment%20Nam%20Ban%20Dalat%204%20bedroom%20valley%20view%20low%20rise%20building%20coffee%20plantation%20surroundings%20peaceful%20residential%20community%20green%20hills&width=800&height=500&seq=a9&orientation=landscape',
    gallery: [
      'https://readdy.ai/api/search-image?query=large%20family%20apartment%20Nam%20Ban%20Dalat%204%20bedroom%20valley%20view%20low%20rise%20building%20coffee%20plantation%20surroundings%20peaceful%20residential%20community%20green%20hills&width=1200&height=700&seq=a9&orientation=landscape',
      'https://readdy.ai/api/search-image?query=large%20family%20living%20room%20apartment%20Nam%20Ban%20Dalat%20valley%20view%20sofa%20sectional%20wooden%20floor%20rug%20children%20play%20corner%20bright%20airy&width=1200&height=700&seq=a9b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=master%20suite%20family%20apartment%20Dalat%20Nam%20Ban%20valley%20view%20large%20room%20walk%20in%20closet%20seating%20area%20window%20morning%20light&width=1200&height=700&seq=a9c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=kitchen%20dining%20family%20apartment%20Dalat%20Nam%20Ban%20large%20island%20wood%20warm%20tone%20open%20plan%20morning%20coffee%20hills%20view&width=1200&height=700&seq=a9d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=master%20bathroom%20family%20apartment%20Dalat%20Nam%20Ban%20large%20soaking%20tub%20double%20vanity%20separate%20shower%20window%20nature%20view&width=1200&height=700&seq=a9e&orientation=landscape',
      'https://readdy.ai/api/search-image?query=children%20bedroom%20family%20apartment%20Dalat%20Nam%20Ban%20colorful%20playful%20bunk%20bed%20wardrobe%20window%20view%20green%20nature%20happy&width=1200&height=700&seq=a9f&orientation=landscape',
      'https://readdy.ai/api/search-image?query=community%20park%20apartment%20complex%20Nam%20Ban%20Dalat%20green%20lawn%20trees%20benches%20families%20gathering%20weekend%20morning%20fresh&width=1200&height=700&seq=a9g&orientation=landscape',
      'https://readdy.ai/api/search-image?query=valley%20panorama%20from%20apartment%20Nam%20Ban%20Dalat%20coffee%20plantation%20below%20green%20hills%20morning%20mist%20dramatic%20landscape&width=1200&height=700&seq=a9h&orientation=landscape',
    ],
  },
};
