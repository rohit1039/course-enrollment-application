import { useEffect, useState } from 'react';
import CourseService from '../../services/course.service';
import PurchaseService from '../../services/purchase.service';
import { useSelector } from 'react-redux';
import Purchase from '../../models/purchase';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const HomePage = () => {

    const [courseList, setCourseList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');

    const currentUser = useSelector(state => state.user);

    useEffect(() => {
        CourseService.getAllCourses().then((response) => {
            setCourseList(response.data);
            toast.info(<i>Courses loaded successfully</i>, {
                position: 'bottom-right'
            })
        }).catch((err) => {
            setErrorMessage("Oops...No courses found!");
        });
    }, []);

    const purchase = (course) => {
        if (!currentUser?.id) {
            setErrorMessage('You should login to buy a course!');
            return;
        }

        const purchase = new Purchase(currentUser.id, course.id, course.title, course.price);

        PurchaseService.savePurchase(purchase).then(() => {
            setInfoMessage('Course purchased successfully');
        }).catch((err) => {
            setErrorMessage('Unexpected error occurred.');
            console.log(err);
        });
    };

    return (
        <div className="container p-3">
            <div className="container">
                {errorMessage ?
                    <Alert className="alert alert-danger">
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{paddingRight:'2px'}} />
                        {errorMessage}
                    </Alert> : null
                }
            </div>

            <div className="container">
                {infoMessage ?
                    <Alert className="alert alert-success"> <FontAwesomeIcon icon={faCheckCircle} /> {infoMessage}
                    </Alert> : null}
            </div>

            <div className="d-flex flex-wrap">
                {courseList.map((item, ind) =>
                    <div key={item.id} className="card m-3 home-card">

                        <div className="card-body">
                            <div className="card-title text-uppercase">
                                {item.title}
                            </div>
                            <div className="card-subtitle text-muted">
                                {item.subtitle}
                            </div>
                        </div>

                        <FontAwesomeIcon icon={faUserGraduate} className="ms-auto me-auto course-icon" />

                        <div className="row mt-2 p-3">
                            <div className="col-6 mt-2 ps-4">
                                {`$ ${item.price}`}
                            </div>
                            <div className="col-6">
                                <button
                                    className="btn btn-outline-success w-100"
                                    onClick={() => purchase(item)}>
                                    Buy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { HomePage };
