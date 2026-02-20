package com.pgbdev.projet12;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class Projet12Application {
    static void main(String[] args) {
        SpringApplication.run(Projet12Application.class, args);
    }
}
