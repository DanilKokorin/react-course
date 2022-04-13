import CardFavorites from '../Сard/card-favorites';
import Footer from '../footer/footer';
import Header from '../header/header';
import { Hotel } from '../../../types/hotel';

type MainWithFavoritesProps = {
  favorites: Hotel[];
};

export default function MainWithFavorites({favorites}: MainWithFavoritesProps) {
  const cities: Array<string> = [];
  favorites.map((favorite) => cities.push(favorite.city.name));
  const sortedCitieys: Array<string> = [...new Set(cities)];

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              <CardFavorites favorites={favorites} citieys={sortedCitieys}/>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
