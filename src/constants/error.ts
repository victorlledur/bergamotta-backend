export const ERRORS = {
    MIDDLEWARES: {
        AUTH: {
            NO_TOKEN: "Sem token fornecido!",
            INVALID: "Token invalido!",
            BEARER_CHECK: "Não é um token bearer",
            FIND: "Não encontrado",
            NO_ID: "Sem ID disponível",
            NOT_BELONG: "Esse token não pertence ao payload específico"
        }
    },
    CONTROLLERS: {
        USER: {
            NO_ID: "Essa ID não existe",
            USER_NOT_FOUND: "Usuário não encontrado",
            EMAIL_EXIST: "Esse e-mail já existe"
        },
        RECOVER_PASSWORD: {
            ERROR: "Ocorreu um erro",
            NOT_FOUND: "Não encontrado"
        },
        RECIPE: {
            NOT_FOUND: "Receita não encontrada"
        },
        RATING: {
            NOT_FOUND: "Avaliação não encontrada"
        },
        PLACE: {
            NOT_FOUND: "Restaurante não encontrado"
        },
        OWNER: {
            EMAIL_EXIST: "Esse e-mail já existe",
            NO_ID: "Essa ID não existe"
        },
        FAVORITES: {
            FAV_NOT_FOUND: "Favorito não encontrado",
            USER_NOT_FOUND: "Usuário não encontrado"
        },
        BLOG_COMMENTS: {
            USER_NOT_FOUND: "Usuário não encontrado"
        },
        AUTH_USER_OWNER: {
            EMAIL_OR_PASS_INCORRECT: "E-mail ou senha incorretos. Por favor, tente novamente",
            PASSWORD_EXPIRED: "A senha fornecida expirou",
            PASSWORD_INCORRECT: "A senha fornecida está incorreta"
        }
    },
    INDEX: {
        FAIL: "Failed connecting to the database! Please check the logs",
    }
}