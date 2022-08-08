module.exports = ({env}) => ({

    email: {
        config: {
            provider: 'sendgrid',
            providerOptions: {
                apiKey: env('SENDGRID_API_KEY')
            },
            settings: {

                defaultFrom: 'renedp1975@gmail.com',
                defaultReplyTo: 'renedp1975@gmail.com',
                testAddress: 'renedsoft@gmail.com'
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
