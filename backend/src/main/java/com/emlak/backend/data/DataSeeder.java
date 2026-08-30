package com.emlak.backend.data;

import com.emlak.backend.domain.entity.*;
import com.emlak.backend.domain.enums.*;
import com.emlak.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final TenantRepository tenantRepository;
    private final AppUserRepository appUserRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(TenantRepository tenantRepository, AppUserRepository appUserRepository, PropertyRepository propertyRepository, LeadRepository leadRepository, PasswordEncoder passwordEncoder) {
        this.tenantRepository = tenantRepository;
        this.appUserRepository = appUserRepository;
        this.propertyRepository = propertyRepository;
        this.leadRepository = leadRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (tenantRepository.count() > 0) {
            log.info("Veritabanında kayıtlı veri mevcut, seed data atlandı.");
            return;
        }

        log.info("Demo seed verileri yükleniyor...");

        // 1. Super Admin
        AppUser superAdmin = AppUser.builder()
                .fullName("Sistem Yöneticisi")
                .email("admin@platform.com")
                .password(passwordEncoder.encode("Admin123!"))
                .phone("+90 500 000 00 00")
                .whatsapp("905000000000")
                .role(Role.SUPER_ADMIN)
                .photoUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80")
                .active(true)
                .build();
        appUserRepository.save(superAdmin);

        // 2. Tenant 1: Korkmaz İnşaat Emlak
        Tenant tenant1 = Tenant.builder()
                .name("Korkmaz İnşaat Emlak")
                .slug("korkmaz")
                .phone("+90 216 345 67 89")
                .whatsapp("905321112233")
                .email("iletisim@korkmaz.com")
                .address("Bağdat Caddesi No:142/A Kadıköy, İstanbul")
                .logoUrl("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80")
                .aboutText("Korkmaz İnşaat Emlak olarak 2005 yılından bu yana İstanbul Anadolu Yakası başta olmak üzere tüm Marmara bölgesinde güvenilir, şeffaf ve profesyonel gayrimenkul danışmanlığı sunuyoruz. Deneyimli uzman kadromuz, geniş portföyümüz ve müşteri memnuniyeti odaklı yaklaşımımızla hayalinizdeki yuvayı ve en doğru yatırım fırsatlarını sizlerle buluşturuyoruz.")
                .status(TenantStatus.ACTIVE)
                .planName("PREMIUM")
                .build();
        tenant1 = tenantRepository.save(tenant1);

        // Office Admin 1
        AppUser officeAdmin1 = AppUser.builder()
                .tenant(tenant1)
                .fullName("Ahmet Korkmaz")
                .email("ofis@korkmaz.com")
                .password(passwordEncoder.encode("Ofis123!"))
                .phone("+90 532 111 22 33")
                .whatsapp("905321112233")
                .role(Role.OFFICE_ADMIN)
                .photoUrl("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80")
                .active(true)
                .build();
        officeAdmin1 = appUserRepository.save(officeAdmin1);

        // Agent 1 & Agent 2
        AppUser agent1 = AppUser.builder()
                .tenant(tenant1)
                .fullName("Ali Yılmaz")
                .email("ali.yilmaz@korkmaz.com")
                .password(passwordEncoder.encode("Agent123!"))
                .phone("+90 535 222 33 44")
                .whatsapp("905352223344")
                .role(Role.AGENT)
                .photoUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80")
                .active(true)
                .build();
        agent1 = appUserRepository.save(agent1);

        AppUser agent2 = AppUser.builder()
                .tenant(tenant1)
                .fullName("Ayşe Kaya")
                .email("ayse.kaya@korkmaz.com")
                .password(passwordEncoder.encode("Agent123!"))
                .phone("+90 533 333 44 55")
                .whatsapp("905333334455")
                .role(Role.AGENT)
                .photoUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80")
                .active(true)
                .build();
        agent2 = appUserRepository.save(agent2);

        // 3. Tenant 2: Örnek Emlak
        Tenant tenant2 = Tenant.builder()
                .name("Örnek Emlak Gayrimenkul")
                .slug("ornek")
                .phone("+90 312 444 55 66")
                .whatsapp("905445556677")
                .email("info@ornekemlak.com")
                .address("Tunalı Hilmi Caddesi No:88 Çankaya, Ankara")
                .logoUrl("https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=200&auto=format&fit=crop&q=80")
                .aboutText("Örnek Emlak, Ankara genelinde konut, ticari ve arsa yatırımlarında 15 yıllık sektör tecrübesiyle doğru ekspertiz, hızlı pazarlama ve güvenli devir süreçleri sunmaktadır.")
                .status(TenantStatus.ACTIVE)
                .planName("TRIAL")
                .build();
        tenant2 = tenantRepository.save(tenant2);

        // Office Admin 2 & Agents for Tenant 2
        AppUser officeAdmin2 = AppUser.builder()
                .tenant(tenant2)
                .fullName("Mustafa Örnek")
                .email("ofis@ornek.com")
                .password(passwordEncoder.encode("Ofis123!"))
                .phone("+90 544 555 66 77")
                .whatsapp("905445556677")
                .role(Role.OFFICE_ADMIN)
                .photoUrl("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80")
                .active(true)
                .build();
        officeAdmin2 = appUserRepository.save(officeAdmin2);

        AppUser agent3 = AppUser.builder()
                .tenant(tenant2)
                .fullName("Mehmet Demir")
                .email("mehmet.demir@ornek.com")
                .password(passwordEncoder.encode("Agent123!"))
                .phone("+90 542 666 77 88")
                .whatsapp("905426667788")
                .role(Role.AGENT)
                .photoUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80")
                .active(true)
                .build();
        agent3 = appUserRepository.save(agent3);

        AppUser agent4 = AppUser.builder()
                .tenant(tenant2)
                .fullName("Zeynep Çelik")
                .email("zeynep.celik@ornek.com")
                .password(passwordEncoder.encode("Agent123!"))
                .phone("+90 543 777 88 99")
                .whatsapp("905437778899")
                .role(Role.AGENT)
                .photoUrl("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80")
                .active(true)
                .build();
        agent4 = appUserRepository.save(agent4);

        // 4. Properties for Tenant 1 (Tekinoğlu)
        seedPropertiesForTenant1(tenant1, agent1, agent2);

        // 5. Properties for Tenant 2 (Örnek)
        seedPropertiesForTenant2(tenant2, agent3, agent4);

        // 6. Leads for Tenant 1 & Tenant 2
        seedLeadsForTenants(tenant1, tenant2, agent1, agent2, agent3);

        log.info("Seed verileri başarıyla yüklendi!");
    }

    private void seedPropertiesForTenant1(Tenant tenant, AppUser agent1, AppUser agent2) {
        Property p1 = Property.builder()
                .tenant(tenant)
                .agent(agent1)
                .title("Bağdat Caddesi Üzerinde Sıfır Lüks 3+1 Daire")
                .description("Caddeye 2. bina, kapalı otoparklı, akıllı ev sistemli, yerden ısıtmalı ve ebeveyn banyolu ultra lüks yaşam alanı. Sahile yürüme mesafesinde, geniş salon ve modern mutfak.")
                .listingType(ListingType.SALE)
                .propertyType(PropertyType.RESIDENCE)
                .price(new BigDecimal("18500000"))
                .currency("TRY")
                .city("İstanbul")
                .district("Kadıköy")
                .neighborhood("Caddebostan")
                .grossArea(165)
                .netArea(140)
                .roomCount("3+1")
                .buildingAge("0 (Sıfır)")
                .floor("4. Kat")
                .totalFloors(8)
                .heatingType("Doğalgaz (Kombi)")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Boş")
                .facade("Güney-Doğu")
                .suitableForLoan(true)
                .furnished(false)
                .hasElevator(true)
                .hasBalcony(true)
                .hasParking(true)
                .inSite(true)
                .bathroomCount(2)
                .latitude(40.9634)
                .longitude(29.0571)
                .eidsReference("EIDS-2024-TK-001")
                .eidsExpiryDate(LocalDate.now().plusMonths(6))
                .status(PropertyStatus.PUBLISHED)
                .viewCount(142L)
                .build();
        p1.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        p1.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80").sortOrder(1).build());
        p1.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80").sortOrder(2).build());
        p1.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&auto=format&fit=crop&q=80").sortOrder(3).build());
        propertyRepository.save(p1);

        Property p2 = Property.builder()
                .tenant(tenant)
                .agent(agent2)
                .title("Moda Sahilde Panoramik Deniz Manzaralı Kiralık 2+1")
                .description("Tarihi Moda semtinde, tramvaya ve iskeleye çok yakın, balkondan Adalar manzaralı, masrafsız, bakımlı aydınlık daire.")
                .listingType(ListingType.RENT)
                .propertyType(PropertyType.RESIDENCE)
                .price(new BigDecimal("42000"))
                .currency("TRY")
                .city("İstanbul")
                .district("Kadıköy")
                .neighborhood("Caferağa (Moda)")
                .grossArea(95)
                .netArea(82)
                .roomCount("2+1")
                .buildingAge("15-20")
                .floor("3. Kat")
                .totalFloors(5)
                .heatingType("Kombi (Doğalgaz)")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Boş")
                .facade("Güney-Batı")
                .suitableForLoan(true)
                .furnished(true)
                .hasElevator(true)
                .hasBalcony(true)
                .hasParking(false)
                .inSite(false)
                .bathroomCount(1)
                .latitude(40.9822)
                .longitude(29.0264)
                .eidsReference("EIDS-2024-TK-002")
                .eidsExpiryDate(LocalDate.now().plusMonths(4))
                .status(PropertyStatus.PUBLISHED)
                .viewCount(89L)
                .build();
        p2.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        p2.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80").sortOrder(1).build());
        p2.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80").sortOrder(2).build());
        propertyRepository.save(p2);

        Property p3 = Property.builder()
                .tenant(tenant)
                .agent(agent1)
                .title("Ataşehir Finans Merkezi Yanında Satılık 220 m² Ofis Katı")
                .description("Uluslararası Finans Merkezi'ne komşu plazada, hazır bölmeli, resepsiyon ve güvenlik hizmetli, 4 araçlık kapalı otopark tahsisli kurumsal ofis katı.")
                .listingType(ListingType.SALE)
                .propertyType(PropertyType.OFFICE)
                .price(new BigDecimal("24500000"))
                .currency("TRY")
                .city("İstanbul")
                .district("Ataşehir")
                .neighborhood("Barbaros")
                .grossArea(220)
                .netArea(190)
                .roomCount("5+1")
                .buildingAge("3")
                .floor("12. Kat")
                .totalFloors(28)
                .heatingType("Merkezi (Pay Ölçer)")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Boş")
                .facade("Kuzey-Doğu")
                .suitableForLoan(true)
                .furnished(false)
                .hasElevator(true)
                .hasBalcony(false)
                .hasParking(true)
                .inSite(true)
                .bathroomCount(2)
                .latitude(40.9950)
                .longitude(29.1120)
                .eidsReference("EIDS-2024-TK-003")
                .eidsExpiryDate(LocalDate.now().plusMonths(8))
                .status(PropertyStatus.PUBLISHED)
                .viewCount(210L)
                .build();
        p3.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        p3.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80").sortOrder(1).build());
        p3.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80").sortOrder(2).build());
        propertyRepository.save(p3);

        Property p4 = Property.builder()
                .tenant(tenant)
                .agent(agent2)
                .title("Şile Sahilköy'de Deniz Manzaralı %25 İmarlı 850 m² Villa Arsası")
                .description("Doğayla iç içe, elektrik, su ve doğalgaz altyapısı hazır, hemen inşaata uygun müstakil parsel.")
                .listingType(ListingType.SALE)
                .propertyType(PropertyType.LAND)
                .price(new BigDecimal("9750000"))
                .currency("TRY")
                .city("İstanbul")
                .district("Şile")
                .neighborhood("Sahilköy")
                .grossArea(850)
                .netArea(850)
                .deedStatus("Müstakil Parsel")
                .usageStatus("Boş")
                .facade("Güney")
                .suitableForLoan(true)
                .latitude(41.1560)
                .longitude(29.4520)
                .eidsReference("EIDS-2024-TK-004")
                .eidsExpiryDate(LocalDate.now().plusMonths(12))
                .status(PropertyStatus.PUBLISHED)
                .viewCount(65L)
                .build();
        p4.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        p4.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80").sortOrder(1).build());
        propertyRepository.save(p4);

        Property p5 = Property.builder()
                .tenant(tenant)
                .agent(agent1)
                .title("Acıbadem Metrobüse 3 Dk Mesafede Sıfır 1+1 Daire")
                .description("Yüksek kira getirisi potansiyeline sahip, metro ve metrobüse yürüme mesafesinde, modern ankastreli butik bina.")
                .listingType(ListingType.SALE)
                .propertyType(PropertyType.RESIDENCE)
                .price(new BigDecimal("4950000"))
                .currency("TRY")
                .city("İstanbul")
                .district("Üsküdar")
                .neighborhood("Acıbadem")
                .grossArea(62)
                .netArea(50)
                .roomCount("1+1")
                .buildingAge("0 (Sıfır)")
                .floor("2. Kat")
                .totalFloors(5)
                .heatingType("Yerden Isıtma")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Boş")
                .facade("Doğu")
                .suitableForLoan(true)
                .hasElevator(true)
                .hasBalcony(true)
                .hasParking(true)
                .bathroomCount(1)
                .latitude(41.0020)
                .longitude(29.0430)
                .status(PropertyStatus.PUBLISHED)
                .viewCount(98L)
                .build();
        p5.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1502005229762-ee152da915ba?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        p5.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&auto=format&fit=crop&q=80").sortOrder(1).build());
        propertyRepository.save(p5);

        Property p6 = Property.builder()
                .tenant(tenant)
                .agent(agent2)
                .title("Çekmeköy Reşadiye'de Özel Havuzlu 5+2 Müstakil Malikane")
                .description("1.200 m² arsa içerisinde, akıllı ev, sauna, hamam, açık yüzme havuzu, kış bahçesi ve müştemilatlı lüks yaşam.")
                .listingType(ListingType.SALE)
                .propertyType(PropertyType.RESIDENCE)
                .price(new BigDecimal("36000000"))
                .currency("TRY")
                .city("İstanbul")
                .district("Çekmeköy")
                .neighborhood("Reşadiye")
                .grossArea(480)
                .netArea(420)
                .roomCount("5+2")
                .buildingAge("2")
                .floor("Müstakil")
                .totalFloors(3)
                .heatingType("VRF / Yerden Isıtma")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Boş")
                .facade("4 Cephe")
                .suitableForLoan(true)
                .furnished(true)
                .hasElevator(true)
                .hasBalcony(true)
                .hasParking(true)
                .inSite(true)
                .bathroomCount(4)
                .latitude(41.0450)
                .longitude(29.2310)
                .status(PropertyStatus.PUBLISHED)
                .viewCount(340L)
                .build();
        p6.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        p6.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80").sortOrder(1).build());
        p6.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80").sortOrder(2).build());
        propertyRepository.save(p6);

        Property p7 = Property.builder()
                .tenant(tenant)
                .agent(agent1)
                .title("Kadıköy Çarşı İçinde Yüksek Cirolu Kiralık Köşe Dükkan")
                .description("Yaya trafiğinin en yoğun olduğu noktada, baca çıkışına uygun, 2 katlı toplam 150 m² kurumsal kiralık dükkan.")
                .listingType(ListingType.RENT)
                .propertyType(PropertyType.OFFICE)
                .price(new BigDecimal("75000"))
                .currency("TRY")
                .city("İstanbul")
                .district("Kadıköy")
                .neighborhood("Osmanağa")
                .grossArea(150)
                .netArea(130)
                .roomCount("2")
                .buildingAge("20+")
                .floor("Düz Giriş")
                .totalFloors(4)
                .heatingType("Klima")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Boş")
                .facade("Kuzey")
                .suitableForLoan(true)
                .bathroomCount(1)
                .latitude(40.9900)
                .longitude(29.0250)
                .status(PropertyStatus.PUBLISHED)
                .viewCount(175L)
                .build();
        p7.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        propertyRepository.save(p7);

        Property p8 = Property.builder()
                .tenant(tenant)
                .agent(agent2)
                .title("Maltepe Sahil Parkına Cephe 3+1 Geniş Daire (Taslak)")
                .description("İlan hazırlık aşamasında, fotoğraflar ve detaylar güncellenecektir.")
                .listingType(ListingType.SALE)
                .propertyType(PropertyType.RESIDENCE)
                .price(new BigDecimal("8200000"))
                .currency("TRY")
                .city("İstanbul")
                .district("Maltepe")
                .neighborhood("İdealtepe")
                .grossArea(135)
                .netArea(118)
                .roomCount("3+1")
                .buildingAge("5-10")
                .floor("2. Kat")
                .totalFloors(6)
                .heatingType("Kombi")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Kiracılı")
                .facade("Güney")
                .suitableForLoan(true)
                .hasElevator(true)
                .hasBalcony(true)
                .hasParking(true)
                .bathroomCount(2)
                .latitude(40.9410)
                .longitude(29.1320)
                .status(PropertyStatus.DRAFT)
                .viewCount(0L)
                .build();
        p8.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        propertyRepository.save(p8);
    }

    private void seedPropertiesForTenant2(Tenant tenant, AppUser agent1, AppUser agent2) {
        Property p1 = Property.builder()
                .tenant(tenant)
                .agent(agent1)
                .title("Çankaya GOP Elçilikler Bölgesinde Satılık Lüks 4+1")
                .description("Seçkin lokasyonda, 7/24 güvenlikli butik sitede, panoramik Ankara manzaralı, şömineli, ebeveyn giyinme odalı.")
                .listingType(ListingType.SALE)
                .propertyType(PropertyType.RESIDENCE)
                .price(new BigDecimal("14500000"))
                .currency("TRY")
                .city("Ankara")
                .district("Çankaya")
                .neighborhood("Gaziosmanpaşa")
                .grossArea(220)
                .netArea(195)
                .roomCount("4+1")
                .buildingAge("4")
                .floor("5. Kat")
                .totalFloors(7)
                .heatingType("Merkezi (Pay Ölçer)")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Boş")
                .facade("Güney-Batı")
                .suitableForLoan(true)
                .hasElevator(true)
                .hasBalcony(true)
                .hasParking(true)
                .inSite(true)
                .bathroomCount(2)
                .latitude(39.8960)
                .longitude(32.8680)
                .status(PropertyStatus.PUBLISHED)
                .viewCount(74L)
                .build();
        p1.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        p1.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80").sortOrder(1).build());
        propertyRepository.save(p1);

        Property p2 = Property.builder()
                .tenant(tenant)
                .agent(agent2)
                .title("İncek Prestijli Sitede Müstakil Bahçeli 5+1 Villa")
                .description("Sosyal tesisli, tenis kortlu, açık/kapalı havuzlu seçkin sitede 600 m² bahçe içinde tripleks villa.")
                .listingType(ListingType.SALE)
                .propertyType(PropertyType.RESIDENCE)
                .price(new BigDecimal("22500000"))
                .currency("TRY")
                .city("Ankara")
                .district("Gölbaşı")
                .neighborhood("İncek")
                .grossArea(380)
                .netArea(330)
                .roomCount("5+1")
                .buildingAge("2")
                .floor("Müstakil")
                .totalFloors(3)
                .heatingType("Doğalgaz (Kombi)")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Boş")
                .facade("4 Cephe")
                .suitableForLoan(true)
                .hasBalcony(true)
                .hasParking(true)
                .inSite(true)
                .bathroomCount(3)
                .latitude(39.8240)
                .longitude(32.7480)
                .status(PropertyStatus.PUBLISHED)
                .viewCount(115L)
                .build();
        p2.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        p2.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80").sortOrder(1).build());
        propertyRepository.save(p2);

        Property p3 = Property.builder()
                .tenant(tenant)
                .agent(agent1)
                .title("Çukurambar İş Kulelerinde Prestijli Kiralık 180 m² Ofis")
                .description("Bakanlıklara ve ana arterlere çok yakın plazada, hazır dekorasyonlu, toplantı salonlu ofis.")
                .listingType(ListingType.RENT)
                .propertyType(PropertyType.OFFICE)
                .price(new BigDecimal("55000"))
                .currency("TRY")
                .city("Ankara")
                .district("Çankaya")
                .neighborhood("Çukurambar")
                .grossArea(180)
                .netArea(155)
                .roomCount("4+1")
                .buildingAge("5")
                .floor("8. Kat")
                .totalFloors(22)
                .heatingType("Merkezi")
                .deedStatus("Kat Mülkiyetli")
                .usageStatus("Boş")
                .facade("Batı")
                .suitableForLoan(true)
                .furnished(true)
                .hasElevator(true)
                .hasParking(true)
                .inSite(true)
                .bathroomCount(2)
                .latitude(39.9050)
                .longitude(32.8120)
                .status(PropertyStatus.PUBLISHED)
                .viewCount(88L)
                .build();
        p3.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        propertyRepository.save(p3);

        Property p4 = Property.builder()
                .tenant(tenant)
                .agent(agent2)
                .title("Gölbaşı Konya Yolu Üzerinde 2.500 m² Ticari İmarlı Arsa")
                .description("Ana yola cepheli, showroom, lojistik veya ticari kompleks yapımına uygun eşsiz yatırım fırsatı.")
                .listingType(ListingType.SALE)
                .propertyType(PropertyType.LAND)
                .price(new BigDecimal("28000000"))
                .currency("TRY")
                .city("Ankara")
                .district("Gölbaşı")
                .neighborhood("Karşıyaka")
                .grossArea(2500)
                .netArea(2500)
                .deedStatus("Müstakil Parsel")
                .usageStatus("Boş")
                .facade("Doğu")
                .suitableForLoan(true)
                .latitude(39.7890)
                .longitude(32.8150)
                .status(PropertyStatus.PUBLISHED)
                .viewCount(42L)
                .build();
        p4.addImage(PropertyImage.builder().url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80").sortOrder(0).build());
        propertyRepository.save(p4);
    }

    private void seedLeadsForTenants(Tenant t1, Tenant t2, AppUser a1, AppUser a2, AppUser a3) {
        List<Property> t1Props = propertyRepository.findByTenantId(t1.getId());
        Property p1 = t1Props.isEmpty() ? null : t1Props.get(0);
        Property p2 = t1Props.size() > 1 ? t1Props.get(1) : null;

        Lead l1 = Lead.builder()
                .tenant(t1)
                .property(p1)
                .assignedAgent(a1)
                .fullName("Canan Aksoy")
                .phone("+90 532 999 88 77")
                .email("canan.aksoy@example.com")
                .message("Merhaba, Caddebostan'daki 3+1 daire için hafta sonu cumartesi günü saat 14:00'te evi görebilir miyiz?")
                .requestType(ListingType.SALE)
                .category(PropertyType.RESIDENCE)
                .source(LeadSource.WEB_FORM)
                .status(LeadStatus.NEW)
                .kvkkConsent(true)
                .notes("Web sitesi üzerinden gelen sıcak talep.")
                .build();
        leadRepository.save(l1);

        Lead l2 = Lead.builder()
                .tenant(t1)
                .property(p2)
                .assignedAgent(a2)
                .fullName("Burak Şengül")
                .phone("+90 533 888 77 66")
                .email("burak.sengul@example.com")
                .message("Moda sahilindeki 2+1 kiralık daireyi eşimle birlikte gezmek istiyoruz.")
                .requestType(ListingType.RENT)
                .category(PropertyType.RESIDENCE)
                .source(LeadSource.WEB_FORM)
                .status(LeadStatus.APPOINTMENT)
                .kvkkConsent(true)
                .notes("Perşembe saat 17:30 için yer gösterme randevusu verildi.")
                .build();
        leadRepository.save(l2);

        Lead l3 = Lead.builder()
                .tenant(t1)
                .property(null)
                .assignedAgent(a1)
                .fullName("Murat Aydın")
                .phone("+90 530 777 66 55")
                .email("murat.aydin@example.com")
                .message("Kadıköy veya Ataşehir bölgesinde 10-15 milyon TL bütçeyle yatırımlık 2+1/3+1 daire arıyorum. Uygun portföyünüz var mı?")
                .requestType(ListingType.SALE)
                .category(PropertyType.RESIDENCE)
                .source(LeadSource.WEB_FORM)
                .status(LeadStatus.CONTACTED)
                .kvkkConsent(true)
                .notes("Müşteri arandı, alternatif 2 ilan sunumu email ile iletildi.")
                .build();
        leadRepository.save(l3);

        Lead l4 = Lead.builder()
                .tenant(t2)
                .assignedAgent(a3)
                .fullName("Selin Yıldız")
                .phone("+90 534 666 55 44")
                .email("selin.yildiz@example.com")
                .message("Çankaya GOP bölgesinde satılık 4+1 daire hakkında detaylı bilgi rica ederim.")
                .requestType(ListingType.SALE)
                .category(PropertyType.RESIDENCE)
                .source(LeadSource.WEB_FORM)
                .status(LeadStatus.NEW)
                .kvkkConsent(true)
                .build();
        leadRepository.save(l4);
    }
}
