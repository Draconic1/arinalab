import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardGroup from 'react-bootstrap/CardGroup';

import {setFood, setOrderStatuses, addOrder} from "./reducerSlice";
import authHeader from "../services/auth-header";


const Component = () => {
    let {id} = useParams();

    const apiBase = useSelector((state) => state.toolkit.apiBase);
    const food = useSelector((state) => state.toolkit.food);
    const orderStatuses = useSelector((state) => state.toolkit.orderStatuses);
    const isLoggedIn = useSelector((state) => state.toolkit.isLoggedIn);
    const user = useSelector((state) => state.toolkit.user);
    const dispatch = useDispatch();
    const isUser = user?.roles?.indexOf("ROLE_USER") > -1;


    useEffect(() => {
        axios.get(`${apiBase}/food/food_type/${id}`, {headers: authHeader()}).then((resp) => {
            console.log(resp.data);
            dispatch(setFood(resp.data));
        });

        axios
            .get(`${apiBase}/orders/info/statuses`, {headers: authHeader()})
            .then((resp) => {
                dispatch(setOrderStatuses(resp.data));
            });
    }, [apiBase, dispatch]);


    const addCart = () => {
        const status = orderStatuses.find((x) => x.name === "В корзине").val;

        axios
            .post(
                `${apiBase}/orders`,
                {
                    status: +status,
                    food_id: +id,
                },
                {headers: authHeader()}
            )
            .then((resp) => {
                dispatch(addOrder(resp.data));
            });
    };

    return (
        <>
            <div style={{textAlign: 'center'}}>
                <h1>В меню:</h1>
                <CardGroup style={{justifyContent: 'center'}}>
                    {food &&
                        food.map((x) => (
                            <Col key={x.id} md="4" xl="3" style={{padding: 10}}>
                                <Card border="warning">
                                    <Card.Img variant="top" src={`${x.image}`} style={{width: "100%", height: 200}}/>
                                    <Card.Body>
                                        <Card.Text style={{textAlign: 'center'}}>
                                            <h4>{x.name}</h4>
                                            <p>Вес: {x.weight} г.</p>
                                            <p>Стоимость: {x.price} руб.</p>
                                            {isLoggedIn && isUser &&(
                                                <Button
                                                    key={x.id}
                                                    variant="warning"
                                                    style={{margin: 10}}
                                                    onClick={addCart}
                                                >
                                                    Добавить в корзину
                                                </Button>
                                            )}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                        ))}
                </CardGroup>
                {!food.length && (
                    <>
                        <h3>Упс! Меню пусто :(</h3>
                    </>
                )}
                <Button
                    variant="link"
                    as={Link}
                    to={`/`}
                    style={{margin: 10, color: 'black'}}>
                    На главную страницу
                </Button>

            </div>
        </>
    );
};

export default Component;
