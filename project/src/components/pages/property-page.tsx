import { AppRoute, AuthorizationStatus } from '../../const';
import Header from '../elements/header/header';
import LeaveFeedback from '../elements/feedback-form/leave-feedback';
import { useNavigate, useParams } from 'react-router-dom';
import Map from '../elements/map/map';
import CardHotel from '../elements/Сard/card-hotel';
import Review from '../elements/reviews/review';
import { useAppSelector } from '../../hooks/useState';
import { useAppDispatch } from '../../hooks/useState';
import { useEffect, useState } from 'react';
import { fetchHotelAction, fetchCommentsAction, fetchNearbyAction, sendFavoriteAction } from '../../store/api-action';
import Loader from '../elements/Loader/loader';
import PageNotFound from './page-not-found';
import { getNearby } from '../../store/offer-data/offer-data';
import { Hotel } from '../../types/hotel';


export default function PropertyPage() {
  const { authorizationStatus } = useAppSelector(({ USER }) => USER);
  const { hotel, comments, nearby, isHotelLodaing } = useAppSelector(({ OFFER }) => OFFER);
  const { emptryHotel } = useAppSelector(({ MAIN }) => MAIN);
  const isAuthorization = authorizationStatus === AuthorizationStatus.Auth;
  const [chosenHotel, setChosenHotel] = useState<Hotel | ''>('');
  const param = useParams().id || '';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  function getRating(rating: number): number {
    return rating * 20;
  }

  function setFavorites() {
    const status = hotel.isFavorite ? '0' : '1';
    const id = hotel.id;
    if (!isAuthorization) {
      return navigate(AppRoute.Login);
    }
    dispatch(sendFavoriteAction({ id, status }));
    dispatch(fetchHotelAction(param));
  }
  if (comments.length) {
  // eslint-disable-next-line no-console
    console.log([...comments].reverse());
  }


  useEffect(() => {
    dispatch(fetchHotelAction(param));
    dispatch(fetchCommentsAction(param));
    dispatch(fetchNearbyAction(param));
    return () => {
      dispatch(getNearby([]));
    };
  }, [param]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [param]);


  if (emptryHotel && !isHotelLodaing) {
    return (
      <PageNotFound />
    );
  }


  if (isHotelLodaing) {
    return (
      <Loader />
    );
  }

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--property">
        <section className="property">
          <div className="property__gallery-container container">
            <div className="property__gallery">
              {hotel.images.map((img, index) => {
                if (index > 5) {
                  return null;
                }

                return (
                  <div key={img} className="property__image-wrapper">
                    <img className="property__image" src={img} alt="studio" />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="property__container container">
            <div className="property__wrapper">
              {hotel.isPremium &&
                <div style={{
                  position: 'relative',
                  margin: '20px 0',
                }}
                >
                  <span className="place-card__mark">Premium</span>
                </div>}
              <div className="property__name-wrapper">
                <h1 className="property__name">
                  {hotel.title}
                </h1>
                <button
                  className={`property__bookmark-button button ${hotel.isFavorite ? ' place-card__bookmark-button--active ' : ''}`}
                  onClick={() => setFavorites()}
                  type="button"
                >
                  <svg className="place-card__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="property__rating rating">
                <div className="property__stars rating__stars">
                  <span style={{ width: `${getRating(hotel.rating)}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="property__rating-value rating__value">{hotel.rating}</span>
              </div>
              <ul className="property__features">
                <li className="property__feature property__feature--entire">
                  {hotel.type}
                </li>
                <li className="property__feature property__feature--bedrooms">
                  {hotel.bedrooms} Bedrooms
                </li>
                <li className="property__feature property__feature--adults">
                  Max {hotel.maxAdults} adults
                </li>
              </ul>
              <div className="property__price">
                <b className="property__price-value">&euro;{hotel.price}</b>
                <span className="property__price-text">&nbsp;night</span>
              </div>
              <div className="property__inside">
                <h2 className="property__inside-title">What&apos;s inside</h2>
                <ul className="property__inside-list">
                  {hotel.goods.map((good) => (
                    <li key={good} className="property__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="property__host">
                <h2 className="property__host-title">Meet the host</h2>
                <div className="property__host-user user">
                  <div className={hotel.host.isPro ? 'property__avatar-wrapper property__avatar-wrapper--pro user__avatar-wrapper' : 'property__avatar-wrapper'}>
                    <img className="property__avatar user__avatar" src={hotel.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="property__user-name">
                    {hotel.host.name}
                  </span>
                  {hotel.host.isPro &&
                    <span className="property__user-status">
                      Pro
                    </span>}
                </div>
                <div className="property__description">
                  <p className="property__text">
                    {hotel.description}
                  </p>
                </div>
              </div>
              <section className="property__reviews reviews">
                <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{comments.length}</span></h2>
                <ul className="reviews__list">
                  {[...comments].reverse().map((comment, index) => {
                    if (index > 9) {
                      return null;
                    }

                    return (
                      <Review review={comment} key={comment.id} />
                    );
                  })}
                </ul>
                {isAuthorization && <LeaveFeedback hotelID={Number(param)} />}
              </section>
            </div>
          </div>
          {nearby.length
            ? <Map selectedPoint={chosenHotel} city={hotel.city.location} hotels={nearby} className="property__map map" />
            : <section className="property__map map"></section>}
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              {nearby.map((item) => <CardHotel paramId={param} setChosenHotel={setChosenHotel} sortedHotel={item} key={item.id} />)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
