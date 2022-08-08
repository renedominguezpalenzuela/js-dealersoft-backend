module.exports = ({env}) => ({

    email: {
        config: {
            provider: 'sendgrid',
            providerOptions: {
                apiKey: env('SENDGRID_API_KEY')
            },
            settings: {

                defaultFrom: env('SENDGRID_MAIN_ADDRESS'),
                defaultReplyTo: env('SENDGRID_MAIN_ADDRESS'),
                testAddress: env('SENDGRID_MAIN_ADDRESS')
                //  defaultFrom: 'mail@dealersoft.de',  defaultReplyTo: 'mail@dealersoft.de'
            }
        }
    },

    upload: {
        config: {
            provider: 'local',
            providerOptions: {
                sizeLimit: 100000
            }
        }
    }
});
