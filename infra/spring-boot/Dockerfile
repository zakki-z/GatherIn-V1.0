FROM eclipse-temurin:17-jdk AS final
WORKDIR /app
COPY code/backend/target/*.jar /app/gatherin-backend.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/gatherin-backend.jar"]