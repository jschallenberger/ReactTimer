import styled, {css} from "styled-components";

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'

interface ButtonContainerProps{
    variant: ButtonVariant
}

const buttonVariants = {
    primary: 'blue',
    secondary: 'orange',
    danger: 'red',
    success: 'green'
};

export const ButtonContainer = styled.button<ButtonContainerProps>`
    height: 50px;
    width: 100px;
    border-radius: 4px;
    border: 0;
    margin: 8px;

    background-color:${props=> props.theme.primary}

    /* ${props=> { 
        return css`
        background-color: ${buttonVariants[props.variant]}`

    }} */
`