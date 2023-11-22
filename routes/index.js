const express = require("express");
const router = express.Router();

//mysql 연결
const mysqlConnObj = require("../config/mysql");
const conn = mysqlConnObj.init();
mysqlConnObj.open(conn);

router.get("/", (req, res) => {
    const rs = req.body;
    const sql = "select * from testdb";
    conn.query(sql, (err, row, fields) => {
        if (err) {
            console.error(err);
        } else {
            for (let rs of row) {
                odate = new Date(rs.date);
                rs.date = `${odate.getFullYear()}-${odate.getMonth() + 1}-${odate.getDate()}`;
            }
        }
        res.render("index", { title: "영민의 게시판", row });
    });
});

router.get("/write", (req, res) => {
    res.render("write", { title: "글쓰기 모드" });
});

router.post("/write", (req, res) => {
    const rs = req.body;
    const sql = "insert into testdb(title, content, clickcount) values(?,?,?) ";
    conn.query(sql, [
        rs.title,
        rs.content,
        0
    ], (err, res, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log('저장완료!');
        }
    });
    res.redirect('/');
});

router.get("/view/:num", (req, res) => {
    const { num } = req.params;
    let sql = "select * from testdb where num = ?";
    conn.query(sql, [num], (err, row, fields) => {
        if (err) {
            console.log(err);
        } else {
            sql = "update testdb set clickcount = clickcount+1 where num = ?";
            conn.query(sql, [num]);
            res.render("view", { title: "게시판 내용보기", row })
        }
    })
})

router.get("/edit/:num", (req, res) => {
    const { num } = req.params;
    const sql = "select * from testdb where num = ?";
    conn.query(sql, [num], (err, row, fields) => {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", { title: "내용 수정", row });
        }
    });
});

router.post("/edit/:num", (req, res) => {
    const { num } = req.params;
    const rs = req.body;
    console.log(req.body);
    const sql = "update testdb set ? where num = ?";
    conn.query(sql, [{
        title: rs.title,
        content: rs.content
    }, num],
        (err, res, fields) => {
            if (err)
                console.log(err);
            else {
                console.log('업데이트 성공');
            }
        });
    res.redirect('/view/' + num);
});

router.get("/del/:num", (req, res) => {
    const { num } = req.params;
    const sql = "delete from testdb where num = ?";
    conn.query(sql, [num], (err, row, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log("삭제성공");
        }
    });
    res.redirect("/");
});

module.exports = router;