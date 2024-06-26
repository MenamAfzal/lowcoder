package org.lowcoder.sdk.exception;

import lombok.Getter;
import org.lowcoder.sdk.util.LocaleUtils;

import java.util.Locale;

@Getter
public class BizException extends BaseException {

    private final BizError error;
    private final String messageKey;
    private final transient Object[] args;

    public BizException(BizError error, String messageKey, Object... args) {
        super(LocaleUtils.getMessage(Locale.ENGLISH, messageKey, args));
        this.error = error;
        this.messageKey = messageKey;
        this.args = args;
    }

    public int getHttpStatus() {
        return error == null ? 500 : error.getHttpErrorCode();
    }

    public int getBizErrorCode() {
        return error == null ? -1 : error.getBizErrorCode();
    }

    @Override
    public String getMessage() {
        return error == null ? super.getMessage() : LocaleUtils.getMessage(Locale.ENGLISH, messageKey, args);
    }

    public String getMessage(Locale locale) {
        return error == null ? super.getMessage() : LocaleUtils.getMessage(locale, messageKey, args);
    }

}
