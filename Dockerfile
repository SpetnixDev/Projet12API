FROM eclipse-temurin:25-jre
RUN groupadd -r spring && useradd -r -g spring spring

WORKDIR /app

COPY target/Projet12API.jar app.jar

RUN chown -R spring:spring /app
USER spring

EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]