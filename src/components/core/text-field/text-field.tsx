import React from 'react';
import Button from '@core/button/button';
import { forwardRef, Fragment, InputHTMLAttributes, ReactNode, useState, useRef, useEffect } from 'react';
import { styled } from 'Styles/stitches.config';

type InputTypes = 'text' | 'number' | 'email' | 'password' | 'tel' | 'textarea';
type TWordCountProps = { count: number; max_length: number };
type TPasswordStrengthProps = { user_input: string; disable_meter: boolean; dark: boolean };
type THintTextProps = { error: string; success: string; hint: string };

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    button_label?: string;
    inline_prefix_element?: ReactNode;
    inline_suffix_element?: ReactNode;
    label?: string;
    type?: InputTypes;
    max_length?: number;
    hint_text?: THintTextProps;
    onButtonClickHandler?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    dark?: boolean;
    error?: string;
    success?: string;
};

/* 
    PasswordStrengthMeter - This designs the section that displays the strength of password input 
*/
const StyledPasswordMeterWrapper = styled('div', {
    height: '0.25rem',
    width: '100%',
    variants: {
        dark: {
            true: { background: '$greyDark500' },
            false: { background: '$greyLight300' },
        },
    },
});
const StyledPasswordMeter = styled(StyledPasswordMeterWrapper, {
    transition: 'width 0.25s ease-in-out',
});
const PasswordStrengthMeter = ({ user_input, disable_meter, dark }: TPasswordStrengthProps) => {
    const zxcvbn = useRef<any>();
    let test_result = { score: 0 };

    useEffect(() => {
        async function loadLibrary() {
            const { default: lib } = await import('zxcvbn');
            zxcvbn.current = lib;
        }
        loadLibrary();
    }, []);

    if (typeof zxcvbn.current === 'function') {
        test_result = zxcvbn.current(user_input);
    }
    const score: number = (test_result.score * 100) / 4;
    const meter_color: any = Object.freeze({
        0: dark ? '$greyDark500' : '$greyLight300',
        1: dark ? '$redDark' : '$redLight',
        2: dark ? '$yellowDark' : '$yellowLight',
        3: dark ? '$greenDark' : '$greenLight',
        4: dark ? '$greenDark' : '$greenLight',
    });
    const generatePasswordStrengthColor = () => {
        return {
            width: `${score}%`,
            background: meter_color[test_result.score],
            height: disable_meter ? '0' : '0.25rem',
        };
    };
    return (
        <StyledPasswordMeterWrapper dark={dark}>
            <StyledPasswordMeter css={generatePasswordStrengthColor()}></StyledPasswordMeter>
        </StyledPasswordMeterWrapper>
    );
};

const HintText = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

/* 
    Word Count component - Displays the total count of characters in the input field against a max allowed character length
*/
const StyledWordCount = styled('div', {
    marginLeft: 'auto',
});
const WordCount = ({ count, max_length }: TWordCountProps) => (
    <StyledWordCount>
        {count}/{max_length}
    </StyledWordCount>
);

/* 
    HelperSection - This section displays hint, error or success text
*/
const HelperSection = styled('section', {
    paddingLeft: '1rem',
    fontSize: '$2xs',
    display: 'inline-flex',
    width: '-webkit-fill-available',
    marginTop: '0.125rem',
    variants: {
        dark: {
            true: { color: '$greyDark200' },
            false: { color: '$greyLight600' },
        },
        error: {
            true: { color: '$coral500' },
        },
        success: {
            true: { color: '$greenLight' },
        },
    },
});

/* 
    TextFieldWrapper - This acts as a wrapper and styles the input field section
*/
const TextFieldWrapper = styled('section', {
    position: 'relative',
    width: '100%',
    display: 'inline-flex',
    flexDirection: 'column',
    borderRadius: '$default',
    borderWidth: '$1',
    borderStyle: 'solid',
    variants: {
        dark: {
            true: {
                borderColor: '$greyDark500',
                backgroundColor: '$greyDark700',

                '&:hover': {
                    borderColor: '$greyDark200',
                },
            },
            false: {
                borderColor: '$greyLight400',
                backgroundColor: '$greyLight100',

                '&:hover': {
                    borderColor: '$greyLight600',
                },
            },
        },
        enabled: {
            true: {
                borderColor: '$greyLight400',
            },
        },
        active: {
            true: {
                borderColor: '$blue500',
            },
        },
        disabled: {
            true: {
                opacity: '0.32',
                cursor: 'not-allowed',
            },
        },
        error: {
            true: {
                borderColor: '$coral500',
                color: '$coral500',
            },
        },
        success: {
            true: {
                borderColor: '$greenLight',
                color: '$greenLight',
            },
        },
    },
    compoundVariants: [
        {
            dark: true,
            error: true,
            css: {
                borderColor: '$redDark',
                color: '$redDark',
            },
        },
        {
            dark: true,
            success: true,
            css: {
                borderColor: '$greenDark',
                color: '$greenDark',
            },
        },
        {
            dark: true,
            enabled: true,
            css: {
                borderColor: '$greyDark500',
            },
        },
    ],
});

/* 
    LabelSection - Styles the input field label 
*/
const LabelSection = styled('label', {
    whiteSpace: 'nowrap',
    fontSize: '$xs',
    position: 'absolute',
    pointerEvents: 'none',
    left: '1rem',
    transition: '0.25s ease all',
    transformOrigin: 'top left',
    variants: {
        dark: {
            true: {
                color: '$greyDark200',
                backgroundColor: '$greyDark700',
            },
            false: {
                color: '$greyLight600',
                backgroundColor: '$greyLight100',
            },
        },
        active: {
            true: { color: '$blue500' },
        },
        enabled: {
            true: { color: '$greyLight700' },
        },
        error: {
            true: { color: '$coral500' },
        },
        success: {
            true: { color: '$greenLight' },
        },
    },
});

/* 
    InputFieldSection - Styles the input field and wraps prefix, suffix and input field
*/
const InputFieldSection = styled('div', {
    position: 'relative',
    display: 'inline-flex',
    width: '100%',
    alignItems: 'center',
    lineHeight: '$lineHeight20',
    // height: '38px',
});

/* 
    SupportingInfoSection - Styles the prefix and suffix elements of input field
*/
const SupportingInfoSection = styled('div', {
    display: 'block',
    variants: {
        active: { false: { color: '$greyLight600' } },
        prefix: { true: { paddingLeft: '1rem' } },
        suffix: { true: { paddingRight: '1rem' } },
        dark: { true: { color: '$greyDark200' } },
    },
    compoundVariants: [
        {
            suffix: true,
            active: true,
            css: {
                color: '$greyLight700',
            },
        },
        {
            suffix: true,
            active: true,
            dark: true,
            css: {
                color: '$greyDark100',
            },
        },
    ],
});

/* 
    TextAreaField - Styles the Text area field
*/
const TextAreaField = styled('textarea', {
    resize: 'none',
    height: '6rem',
    overflow: 'auto',
    overflowWrap: 'break-word',
    padding: '1rem 1rem',
    textAlign: 'justify',
    borderRadius: '$default',
    background: 'none',
    fontSize: '$xs',
    fontWeight: '$regular',
    width: '100%',
    display: 'block',
    minWidth: '0',
    boxSizing: 'border-box',
    border: 'none',
    outline: 'none',

    variants: {
        dark: {
            true: {
                color: '$greyLight100',

                '&:readonly': {
                    color: '$greyDark200',
                },
            },
            false: {
                color: '$greyLight700',

                '&:readonly': {
                    color: '$greyLight600',
                },
            },
        },
    },

    '& ~ label': {
        top: '1rem',
    },

    '&:focus:not(textarea:read-only) ~ label': {
        transform: 'translateY(-1.5rem) scale(0.75)',
        padding: '0 4px',
    },
});

/* 
    InputField - Styles the input field
*/
const InputField = styled('input', {
    borderRadius: '$default',
    background: 'none',
    fontSize: '$xs',
    fontWeight: '$regular',
    width: '100%',
    height: '2.5rem',
    display: 'block',
    minWidth: '0',
    boxSizing: 'border-box',
    border: 'none',
    outline: 'none',
    padding: '0 1rem',
    textOverflow: 'ellipsis',

    variants: {
        dark: {
            true: {
                color: '$greyDark100',

                '&:readonly': {
                    color: '$greyDark200',
                },
            },
            false: {
                color: '$greyLight700',

                '&:readonly': {
                    color: '$greyLight600',
                },
            },
        },
    },

    '&:focus:not(input:read-only) ~ label': {
        transform: 'translateY(-1.2rem) scale(0.75)',
        padding: '0 4px',
    },
});

const TextField = forwardRef<HTMLInputElement & HTMLTextAreaElement, TextFieldProps>(
    (
        {
            button_label,
            dark,
            id,
            hint_text,
            inline_prefix_element,
            inline_suffix_element,
            label,
            max_length,
            type,
            onButtonClickHandler,
            onChange,
            ...props
        },
        ref,
    ) => {
        const [is_active, setIsActive] = useState(false);
        const [is_enabled, setIsEnabled] = useState(false);
        const [value, setValue] = useState('');
        const [count, setCount] = useState(0);

        const { error, hint, success } = hint_text ?? {};

        const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const text = e.target.value;
            if (props.disabled || props.readOnly) {
                return;
            }
            if (max_length && text.length > max_length) {
                return;
            }
            setValue(text);
            setCount(text.length);

            onChange?.(e);
        };

        const generateHintText = () => {
            if (success) return <HintText>{success}</HintText>;
            else if (error) return <HintText>{error}</HintText>;
            else if (hint) return <HintText>{hint}</HintText>;
        };

        const styleLabelFloat = () => {
            if (is_active && type !== 'textarea') {
                return {
                    transform: 'translate(0, -1.2rem) scale(0.75)',
                    padding: '0 4px',
                };
            } else if (is_active && type === 'textarea') {
                return {
                    transform: 'translate(0, -1.5rem) scale(0.75)',
                    padding: '0 4px',
                };
            }
        };

        const styleTextFieldWrapper = () => {
            if (label?.trim()?.length === 0) {
                return dark ? { borderColor: '$greyDark700' } : { borderColor: '$greyLight100' };
            }
        };

        const is_button_disabled = props.disabled || Boolean(error) || (Boolean(success) && !value) || !value;

        return (
            <Fragment>
                <TextFieldWrapper
                    active={is_active}
                    enabled={is_enabled}
                    error={Boolean(error)}
                    success={Boolean(success)}
                    disabled={props.disabled}
                    dark={dark}
                    css={styleTextFieldWrapper()}
                >
                    <InputFieldSection>
                        {type === 'textarea' ? (
                            <TextAreaField
                                {...props}
                                ref={ref}
                                value={value}
                                dark={dark}
                                readOnly={props.readOnly}
                                disabled={props.disabled}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextChange(e)}
                            />
                        ) : (
                            <Fragment>
                                {inline_prefix_element && (
                                    <SupportingInfoSection prefix>{inline_prefix_element}</SupportingInfoSection>
                                )}
                                <InputField
                                    {...props}
                                    ref={ref}
                                    dark={dark}
                                    type={type}
                                    value={value}
                                    readOnly={props.readOnly}
                                    disabled={props.disabled}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange(e)}
                                    onFocus={() => {
                                        setIsActive(true);
                                        setIsEnabled(false);
                                    }}
                                    onBlur={(e) => (!e.target.value ? setIsActive(false) : setIsEnabled(true))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            !!button_label && !is_button_disabled && onButtonClickHandler?.();
                                            e.currentTarget.blur();
                                        }
                                    }}
                                />
                                {inline_suffix_element && (
                                    <SupportingInfoSection active={is_active} suffix dark={dark}>
                                        {inline_suffix_element}
                                    </SupportingInfoSection>
                                )}
                                {button_label && (
                                    <Button
                                        color="primary"
                                        size="large"
                                        disabled={is_button_disabled}
                                        onClick={() => onButtonClickHandler?.()}
                                        css={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginRight: '-1px' }}
                                    >
                                        {button_label}
                                    </Button>
                                )}
                            </Fragment>
                        )}
                        {label && (
                            <LabelSection
                                htmlFor={id}
                                enabled={is_enabled}
                                active={is_active}
                                error={Boolean(error)}
                                success={Boolean(success)}
                                dark={dark}
                                css={styleLabelFloat()}
                            >
                                {label}
                            </LabelSection>
                        )}
                    </InputFieldSection>
                    {type === 'password' && (
                        <PasswordStrengthMeter
                            dark={Boolean(dark)}
                            user_input={value}
                            disable_meter={(props.readOnly || props.disabled) ?? false}
                        />
                    )}
                </TextFieldWrapper>
                <HelperSection error={Boolean(error)} success={Boolean(success)} dark={dark}>
                    {generateHintText()}
                    {max_length && max_length > 0 && <WordCount count={count} max_length={max_length} />}
                </HelperSection>
            </Fragment>
        );
    },
);

TextField.displayName = 'TextField';

export default TextField;
