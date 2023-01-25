const _ = require('lodash');

module.exports = (plugin) => {
  const getController = name => {
    return strapi.plugins['users-permissions'].controller(name);
  };

  // Create the new controller
  plugin.controllers.user.updateMe = async (ctx) => {
	  
	//Obtengo el usuario autenticado  
    const user = ctx.state.user;
	//console.log(user);


    // User has to be logged in to update themselves
    if (!user) {		
      return ctx.unauthorized();
    }
	
	//Datos recibidos desde el cliente
	//console.log("Datos");
	//console.log(ctx.request.body);

    // Pick only specific fields for security
	//_.pick -- selecciona solo los campos pasados como parametros
    const newData = _.pick(ctx.request.body.data, ['email', 'username', 'first_name', 'last_name', 'company_name', 'street', 'house_number', 'city', 'postal_code', 'phone', 'website', 'steuer_nr', 'ust_Idnr', 'geschaftsfuhrer', 'iban', 'bic_swift_code', 'hrb_walsrode','hrb_ort' ,'bank_name', 'full_registration', 'employees_number']);
	
	

	
	//const newData = ctx.request.body.data;
	
	//console.log("New Data");
	//console.log(newData);

    // Make sure there is no duplicate user with the same username
    if (newData.username) {
      const userWithSameUsername = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { username: newData.username } });

      if (userWithSameUsername && userWithSameUsername.id != user.id) {
        return ctx.badRequest('Username already taken');
      }
    }
	

    // Make sure there is no duplicate user with the same email
    if (newData.email) {
      const userWithSameEmail = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { email: newData.email.toLowerCase() } });

      if (userWithSameEmail && userWithSameEmail.id != user.id) {
        return ctx.badRequest('Email already taken');
      }
      newData.email = newData.email.toLowerCase();
    }

    // Check if user is changing password and make sure passwords match
  /*  if (newData.password) {
      if (!newData.confirmPassword) {
        return ctx.badRequest('Missing password confirmation');
      } else if (newData.password !== newData.confirmPassword) {
        return ctx.badRequest('Passwords don\'t match')
      }
      delete newData.confirmPassword
    }*/

    // Reconstruct context so we can pass to the controller
    ctx.request.body = newData
    ctx.params = { id: user.id }
	
	//console.log("ctx");
	//console.log(user.id);
	//console.log(ctx);

    // Update the user and return the sanitized data
    return await getController('user').update(ctx)
  };

  // Add the custom route
  plugin.routes['content-api'].routes.unshift({
    method: 'PUT',
    path: '/users/me',
    handler: 'user.updateMe',
    config: {
      prefix: ''
    }
  });

  return plugin;
};