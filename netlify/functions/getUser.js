const admin = require('./firebaseAdmin.js');
 
exports.handler = async (event, context) => {
  try {
    const userId = event.queryStringParameters.id;
    const userDoc = await admin.firestore().collection('users').doc("user123").get();
 
    if (!userDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Usuario no encontrado' }),
      };
    }
 
    return {
      statusCode: 200,
      body: JSON.stringify(userDoc.data()),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener el usuario' }),
    };
  }
};