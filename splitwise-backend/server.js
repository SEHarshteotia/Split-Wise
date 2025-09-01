const express = require("express");
const errorHandler = require("./middelwear/errorHandler");
const { ConnectDB } = require("./Databse/Dbmysql");
const app = express();
 require("dotenv").config();
 const cors  = require("cors");


const port =  process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/contacts',require("./routes/contactRoute"));
app.use('/api/users',require("./routes/userRoute"));
app.use('/api/expenses',require("./routes/expensesRoute"));
app.use('/api/friends',require("./routes/friendsRoute"));
app.use('/api/friends_expenses',require("./routes/friendsExpensesRoute"));
app.use('/api/groups',require("./routes/gro_upRoute"));
app.use('/api/group',require("./routes/groupMembersRoute"));
app.use('/api/group-expenses',require("./routes/groupExpensesRoute"));
app.use(errorHandler);
 

const startserver  = async () => {
    await ConnectDB();
    app.listen(port,()=>{
    console.log(`Server is Listening On the port ${port}`)
});
}
startserver();



 