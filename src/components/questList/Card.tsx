import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addBooking } from '../../redux/slices/bookingSlice'; // Импортируем действие добавления бронирования
import styles from './Card.module.css';
import imageCard from '../../assets/img/imageCard.png';
import imageCard2 from '../../assets/img/imageCard2.png';
import imageCard3 from '../../assets/img/imageCard3.png';
import { FaHeart, FaMapMarkerAlt, FaUsers, FaStar } from 'react-icons/fa';
import BookingButton from '../Buttons/Buttons';

const CardComponent = () => {
  const cardImages = [imageCard, imageCard2, imageCard3];
  const dispatch = useDispatch();

  // Подключаем фильтры из Redux
  const { questType, players, date, time } = useSelector((state: RootState) => state.filters);

  // Инициализация состояния из localStorage для лайков
  const [liked, setLiked] = useState<boolean[]>(
    () => JSON.parse(localStorage.getItem('likedCards') || '[]') || Array(cardImages.length).fill(false)
  );

  // Сохранение состояния лайков в localStorage
  useEffect(() => {
    localStorage.setItem('likedCards', JSON.stringify(liked));
  }, [liked]);

  // Фильтрация карточек
  const filteredCards = cardImages.filter((_, index) => {
    // Фильтрация по типу квеста
    if (questType && index !== 0) return false; // Убедитесь, что фильтрация работает, как нужно

    // Фильтрация по количеству игроков
    if (players && players !== "1 - 8 человек") return false;

    // Фильтрация по дате
    if (date && date !== "2024-12-07") return false;

    // Фильтрация по времени
    if (time && time !== "12:00") return false;

    return true;
  });

  // Логика переключения лайка
  const toggleLike = (index: number) => {
    const newLiked = [...liked];
    newLiked[index] = !newLiked[index];
    setLiked(newLiked);
  };

  // Обработчик для бронирования
  const handleBooking = (questName: string) => {
    // Получаем дату и время из фильтров или используем значения по умолчанию
    const bookingDate = date || "2024-12-07";
    const bookingTime = time || "12:00";

    // Добавляем бронирование в Redux
    dispatch(addBooking({ questName, date: bookingDate, time: bookingTime }));

    // Показываем сообщение пользователю
    alert(`Бронирование для квеста "${questName}" успешно!`);
  };

  return (
    <div className={styles.cardContainer}>
      {filteredCards.map((image, index) => (
        <div className={styles.card} key={index}>
          <img src={image} alt={`Картинка ${index + 1}`} className={styles.cardImage} />
          <h3 className={styles.cardTitle}>
            16+
            <button
              className={styles.heartButton}
              onClick={() => toggleLike(index)}
            >
              <FaHeart
                className={liked[index] ? styles.heartIconLiked : styles.heartIcon}
              />
            </button>
          </h3>

          {/* Добавление информации под картой */}
          <div className={styles.cardDetails}>
            <div className={styles.cardDetail}>
              <div className={styles.titleContainer}>
                <span className={styles.eventTitle}>Гарри и искусство магии</span>
              </div>
              <div className={styles.rating}>
                <FaStar className={styles.starIcon} />
                <span>9.8</span>
              </div>
            </div>

            <div className={styles.cardDetailss}>
              <div className={styles.cardDetailAd}>
                <div className={styles.questAddres}>
                  <FaMapMarkerAlt className={styles.icon} />
                  <span className={styles.addres}>Переулок Гвардейский, 54а</span>
                </div>
              </div>

              <div className={styles.playerInfoContainer}>
                <div className={styles.gameDetails}>
                  <div className={styles.playerCount}>
                    <FaUsers className={styles.icon} />
                    <span className={styles.numberOfPeople}>1 - 8 человек</span>
                  </div>

                  <div className={styles.priceDetails}>
                    <span className={styles.pryce}>От 1 000₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Добавление кнопки бронирования */}
          <div className={styles.buttonContainer}>
            <BookingButton onClick={() => handleBooking("Гарри и искусство магии")} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardComponent;

