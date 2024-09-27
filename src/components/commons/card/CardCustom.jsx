import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import "./style.css";
import avatar from "../../../assets/avatar.png";

export default function CardCustom({ name, id, role, avatarUser }) {
  return (
    <Card
      style={{ backgroundColor: "white", boxShadow: "none" }}
      sx={{ maxWidth: 345 }}
    >
      <CardHeader
        style={{ color: "gray" }}
        color="#0000"
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <img
              width={"100%"}
              height={"100%"}
              src={avatarUser ? avatarUser : avatar}
            ></img>
          </Avatar>
        }
        title={`${name} - ${role}`}
        subheader={`Mã số: ${id}`}
      />
    </Card>
  );
}
