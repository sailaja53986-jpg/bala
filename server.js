const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {

    res.send("Student Login Backend Running");

});

app.post("/login", async (req, res) => {

    try {

        const { username, mobile } = req.body;

        if (!username || !mobile) {

            return res.status(400).json({
                error: "All fields required"
            });

        }

        const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("username", username)
        .eq("mobile", mobile)
        .maybeSingle();

        if (error) {

            return res.status(500).json({
                error: error.message
            });

        }

        if (!data) {

            return res.status(401).json({
                error: "Invalid username or mobile"
            });

        }

        res.json({
            success: true,
            message: "Login Successful"
        });

    } catch (err) {

        res.status(500).json({
            error: "Server Error"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});
