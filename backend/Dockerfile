# ---------- 1. AŞAMA: BUILD ----------
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Önce sadece pom.xml'i kopyala -> bağımlılıklar cache'lensin,
# kaynak kod değiştiğinde bağımlılıklar tekrar indirilmesin
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Şimdi kaynak kodu kopyala ve paketle
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- 2. AŞAMA: RUNTIME ----------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Build aşamasından sadece derlenmiş jar'ı al
COPY --from=build /app/target/*.jar app.jar

# Railway/Render gibi platformlar PORT env değişkenini otomatik verir,
# Spring Boot bunu server.port ile okuyabilsin diye application.properties'de
# server.port=${PORT:8080} şeklinde ayarlamanı öneririm
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
