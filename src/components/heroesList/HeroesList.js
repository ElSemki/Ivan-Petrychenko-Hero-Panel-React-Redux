import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createSelector } from 'reselect';
import { fetchHeroes } from '../../actions';
import { useHttp } from '../../hooks/http.hook';
import HeroesListItem from '../heroesListItem/HeroesListItem';
import Spinner from '../spinner/Spinner';
import './heroesList.scss';
import { heroDelete } from './heroesSlice';
const HeroesList = () => {
	const filteredHeroesSelector = createSelector(
		state => state.filters.filterValue,
		state => state.heroes.heroes,
		(filter, heroes) =>
			filter === 'all' ? heroes : heroes.filter(hero => hero.element === filter)
	);

	const filteredHeroes = useSelector(filteredHeroesSelector);

	const heroesLoadingStatus = useSelector(
		state => state.heroes.heroesLoadingStatus
	);

	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(fetchHeroes(request));
		// eslint-disable-next-line
	}, []);

	const deleteHeroHandler = useCallback(
		id => {
			request(`http://localhost:3001/heroes/${id}`, 'DELETE')
				.then(dispatch(heroDelete(id)))
				.catch(e => console.error(e));
		},
		// eslint-disable-next-line
		[request]
	);

	if (heroesLoadingStatus === 'loading') {
		return <Spinner />;
	} else if (heroesLoadingStatus === 'error') {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
	}

	const renderHeroesList = arr => {
		if (arr.length === 0) {
			return (
				<CSSTransition timeout={0} classNames="hero">
					<h5 className="text-center mt-5">Героев пока нет</h5>
				</CSSTransition>
			);
		}

		return arr.map(({ id, ...props }) => {
			return (
				<CSSTransition key={id} timeout={500} classNames="hero">
					<HeroesListItem {...props} onDelete={() => deleteHeroHandler(id)} />
				</CSSTransition>
			);
		});
	};

	const elements = renderHeroesList(filteredHeroes);
	return <TransitionGroup component="ul">{elements}</TransitionGroup>;
};

export default HeroesList;
