FROM eclipse-temurin:22-alpine
# ARG JAR_FILE=target/*.jar
# COPY ${JAR_FILE} app.jar
COPY . ./
# Ensure mvnw has LF line endings
RUN sed -i 's/\r$//' mvnw && \
    chmod +x mvnw && \
    ./mvnw clean install -DskipTests
EXPOSE 3000
ENTRYPOINT ["java","-jar","target/demo-0.0.1-SNAPSHOT.jar"]
