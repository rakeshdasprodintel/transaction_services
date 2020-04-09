var modelsToUpdate = require('../database/models');

/* Never to be used! [IMPORTANT]*/
modelsToUpdate.sequelize.sync({ "force" : true }).then(function() {
  console.log("Done!!!!");
  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(0);
});
