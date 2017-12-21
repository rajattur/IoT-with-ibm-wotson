const watson = require('watson-developer-cloud');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const Users = new Map();

const conversation = watson.conversation({
    username: '1c7dc479-334f-42b6-bf6d-f1cf74d0055a',
    password: 'k6L7vEaPOuSg',
    version: 'v1',
    version_date: '2017-05-26'
});

const createUserEntry = (req,res,twilioReq) => {

    let options = {
        workspace_id: 'a13baecf-4946-4656-acad-e37ef04f68ea',
        input: {'text': twilioReq.Body},
    };


    conversation.message(options,  function(err, response) {
        let intent;
        if (err)
            console.log('error:', err);
        else {
            intent = response.intents[0].intent;
            const twiml = new MessagingResponse();
            twiml.message(response.output.text[0]);

            if (Users.get(twilioReq.From)) {
                console.log(`User with number ${twilioReq.From} exists`);
                options.context = {conversation_id : Users.get(twilioReq.From)}
            } else {
                console.log('creating users info');
                Users.set(twilioReq.From, response.context.conversation_id);
                console.log(Users.get(twilioReq.From))
            }
            console.log(options);
            console.log('intent: ', intent);

            if (intent === 'goodbye') {
                Users.delete(twilioReq.From)
            }

            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
        }

    });
};

module.exports = {createUserEntry};