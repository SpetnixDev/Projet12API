package com.pgbdev.projet12.technical.exception;

import com.pgbdev.projet12.domain.auth.RefreshToken;
import com.pgbdev.projet12.technical.config.ErrorCode;

public class RefreshTokenAuthException extends APIException {
    public RefreshTokenAuthException(String cause, String customMessage) {
        super("Authentication failed from refresh token verification: " + cause,
              RefreshToken.class,
              customMessage);
    }

  @Override
  public ErrorCode getErrorCode() {
    return ErrorCode.AUTHENTICATION_FAILED;
  }
}
