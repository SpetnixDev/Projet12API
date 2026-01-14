package com.pgbdev.projet12.security;

import com.pgbdev.projet12.service.auth.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    /**
     * Main method executed on each HTTP request.
     * It checks the Authorization header, extracts and validates the JWT.
     *
     * @param request  the incoming request
     * @param response the ongoing response
     * @param filterChain the filter chain to continue
     * @throws ServletException servlet exception
     * @throws IOException IO exception
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);

            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            if (!jwtService.isTokenValid(jwt)) {
                filterChain.doFilter(request, response);

                return;
            }

            AuthPrincipal principal = new AuthPrincipal(
                    jwtService.getAuthAccountIdFromToken(jwt),
                    jwtService.getOwnerIdFromToken(jwt),
                    jwtService.getAccountTypeFromToken(jwt)
            );

            List<GrantedAuthority> authorities = jwtService.getRolesFromToken(jwt).stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
