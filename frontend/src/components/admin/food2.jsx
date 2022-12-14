import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

import {addFood, setFood, updateFood, setFood_Type} from "../reducerSlice";
import authHeader from "../../services/auth-header";



const Component = () => {
    const [Name, setName] = useState("");
    const [Price, setPrice] = useState("");
    const [Weight, setWeight] = useState("");
    const [Image, setImage] = useState("");
    const [FoodType, setFoodType] = useState("");


    const apiBase = useSelector((state) => state.toolkit.apiBase);
    const food = useSelector((state) => state.toolkit.food);
    const food_type = useSelector((state) => state.toolkit.food_type);
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [selectedName, setSelectedName] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");
    const [selectedWeight, setSelectedWeight] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedFoodType, setSelectedFoodType] = useState("");



    useEffect(() => {
        axios.get(`${apiBase}/food?all=1`, { headers: authHeader() }).then((resp) => {
            dispatch(setFood(resp.data));
        });

        axios.get(`${apiBase}/food`, { headers: authHeader() }).then((resp) => {
            dispatch(setFood(resp.data));
        });
        axios.get(`${apiBase}/food_type`, { headers: authHeader() }).then((resp) => {
            dispatch(setFood_Type(resp.data));
        });

    }, [apiBase, dispatch]);

    const addNew = (e) => {
        e.preventDefault();

        axios
            .post(
                `${apiBase}/food`,
                {
                    name: Name,
                    price: +Price,
                    weight: +Weight,
                    image: Image,
                    food_type_id: +FoodType,
                },
                { headers: authHeader() }
            )
            .then((resp) => {
                dispatch(addFood(resp.data));
            });
    };

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        const foodd = food.find((x) => x.id === id);

        if (!foodd) return;

        setSelectedId(foodd.id);
        setSelectedName(foodd.name);
        setSelectedPrice(foodd.price);
        setSelectedWeight(foodd.weight);
        setSelectedImage(foodd.image);
        setSelectedFoodType(foodd.food_type_id);

        setShow(true);
    };


    const handleSave = () => {
        const foodd = food.find((x) => x.id === selectedId);

        if (!foodd) return;

        const o = { ...foodd };
        o.id = selectedId;
        o.name = selectedName;
        o.price = selectedPrice;
        o.weight = selectedWeight;
        o.image = selectedImage;
        o.food_type_id = selectedFoodType;

        axios
            .put(`${apiBase}/food/${o.id}`, o, { headers: authHeader() })
            .then((resp) => {
                dispatch(updateFood(o));
                handleClose();
            });
    };


    return (
        <div className="mb-5 p-2 border border-top-0 rounded-bottom">
            <h3>???????????? ????????</h3>

            {food && (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>????????????????</th>
                        <th>????????</th>
                        <th>??????</th>
                        <th>??????????????????????</th>
                        <th>??????????????????</th>
                        <th>????????????????</th>
                    </tr>
                    </thead>
                    <tbody>
                    {food.length > 0 &&
                        food.map((x) => {
                            return (
                                <tr key={x.id}>
                                    <td>{x.id}</td>
                                    <td>{x.name}</td>
                                    <td>{x.price}</td>
                                    <td>{x.weight}</td>
                                    <td>{x.image}</td>
                                    <td>{x.food_type_id}</td>
                                    <td>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => handleShow(x.id)}
                                        >
                                            &#9998;
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    {!food.length && (
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            )}

            <h3>???????????????? ?????????? ??????????</h3>

            <Form onSubmit={addNew}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>????????????????</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="????????????????"
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>??????????????????</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="??????????????????"
                                value={Price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>??????</Form.Label>
                            <Form.Control
                                type="number"
                                name="weight"
                                placeholder="??????"
                                value={Weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>?????????????????????? (????????????)</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                placeholder="??????????????????????"
                                value={Image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>??????????????????</Form.Label>
                            <Form.Select
                                name="food_type_id"
                                placeholder="??????????????????"
                                value={FoodType}
                                onChange={(e) => setFoodType(e.target.value)}
                                onBlur={(e) => setFoodType(e.target.value)}
                            >
                                <option disabled value="">
                                    ???????????????? ??????????????????
                                </option>
                                {food_type &&
                                    food_type.map((x) => (
                                        <option key={x.id} value={x.id}>
                                            {x.id} - {x.name}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit">
                    ????????????????
                </Button>
            </Form>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>????????????????</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>????????????????</Form.Label>
                        <Form.Control
                            type="text"
                            name="image"
                            placeholder="??????????????????????"
                            value={selectedName}
                            onChange={(e) => setSelectedName(e.target.value)}
                            onBlur={(e) => setSelectedName(e.target.value)}
                        />
                    </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>??????????????????</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            placeholder="??????????????????"
                            value={selectedPrice}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                            onBlur={(e) => setSelectedPrice(e.target.value)}
                        />
                    </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>??????</Form.Label>
                        <Form.Control
                            type="number"
                            name="weight"
                            placeholder="??e??"
                            value={selectedWeight}
                            onChange={(e) => setSelectedWeight(e.target.value)}
                            onBlur={(e) => setSelectedWeight(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>??????????????????????</Form.Label>
                        <Form.Control
                            type="text"
                            name="image"
                            placeholder="??????????????????????"
                            value={selectedImage}
                            onChange={(e) => setSelectedImage(e.target.value)}
                            onBlur={(e) => setSelectedImage(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>??????????????????</Form.Label>
                        <Form.Select
                            name="food_type_id"
                            placeholder="??????????????????"
                            value={selectedFoodType}
                            onChange={(e) => setSelectedFoodType(e.target.value)}
                            onBlur={(e) => setSelectedFoodType(e.target.value)}
                        >
                            <option disabled value="">
                                ???????????????? ??????????????????
                            </option>
                            {food_type &&
                                food_type.map((x) => (
                                    <option key={x.id} value={x.id}>
                                        {x.id} - {x.name}
                                    </option>
                                ))}
                        </Form.Select>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        ????????????
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        ??????????????????
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Component;
