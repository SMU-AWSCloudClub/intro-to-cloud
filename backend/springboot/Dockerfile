FROM eclipse-temurin:22-alpine
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 3000
ENTRYPOINT ["java","-jar","/app.jar"]
