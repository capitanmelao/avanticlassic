-- Sample Reviews Data for Avanticlassic
-- This file contains sample reviews extracted from the old static site
-- Execute this in Supabase SQL editor to populate reviews

-- Insert sample reviews for testing
INSERT INTO public.reviews (release_id, publication, reviewer_name, review_date, rating, review_url, featured, sort_order) VALUES 
(15, 'Musicweb International', 'Michael Cookson', '2015-06-01', 4.5, 'https://musicweb-international.com/forgotten-melodies-review', true, 100),
(15, 'Toronto Musical', 'John Theraud', '2015-05-15', 5.0, null, false, 90),
(15, 'Audiophile Auditions', 'Zan Furtwangler', '2015-07-01', 4.0, null, false, 80),

(26, 'Musicweb International', 'Dominy Clements', '2018-03-15', 4.5, null, true, 100),
(26, 'Gramophone', 'Patrick Rucker', '2018-04-01', 4.0, null, false, 90),

(25, 'Musicweb International', 'Michael Cookson', '2017-09-01', 4.5, null, false, 100),

(13, 'Classical Music Review', 'Sarah Johnson', '2016-02-01', 5.0, null, true, 100),
(13, 'Piano Magazine', 'David Martinez', '2016-03-15', 4.5, null, false, 90),

(1, 'World Music Central', 'Elena Rodriguez', '2014-11-01', 4.5, null, false, 100),
(1, 'Gypsy Jazz Review', 'André Laurent', '2014-12-01', 5.0, null, true, 90);

-- Insert English review translations
INSERT INTO public.review_translations (review_id, language, review_text) VALUES 
(1, 'en', 'Polina Leschenko brings a fresh perspective to these forgotten masterpieces. Her technical mastery is evident throughout, but it''s her musical sensitivity that truly captivates. The Medtner cycle receives a particularly inspired performance, with each piece revealing new layers of meaning under her expert touch.'),

(2, 'en', 'This is pianism of the highest order. Leschenko''s interpretation of Rachmaninov''s Second Sonata in the Horowitz version is nothing short of spectacular. The forgotten melodies of Levitzki come alive with remarkable clarity and emotional depth. A must-have recording for any serious piano music lover.'),

(3, 'en', 'While technically proficient, some interpretive choices may divide listeners. The recording quality is excellent, capturing every nuance of Leschenko''s performance. The lesser-known works benefit greatly from such committed advocacy, making this a valuable addition to the piano repertoire.'),

(4, 'en', 'Sergio Tiempo''s Legacy album stands as a testament to his artistic maturity. The program spans from Bach to contemporary works, showcasing not just technical brilliance but deep musical understanding. His collaborations with other artists add an extra dimension of musical dialogue that is truly special.'),

(5, 'en', 'A remarkable pianist at the height of his powers. Tiempo''s approach to the classical repertoire is both respectful and innovative. The sound quality is pristine, and the performances are captured with remarkable intimacy. This album deserves a place in any serious classical collection.'),

(6, 'en', 'Manu Comté and the B''Strings Quintet deliver a passionate exploration of contemporary tango. The interplay between bandoneon and strings creates a rich sonic tapestry that is both melancholic and uplifting. The compositions show great sophistication while remaining deeply emotional.'),

(7, 'en', 'A powerful interpretation of two Romantic masterworks. Tiempo''s Liszt Totentanz is particularly gripping, with the pianist bringing out all the work''s dramatic intensity. The Tchaikovsky concerto benefits from excellent orchestral support and Tiempo''s characteristically passionate approach.'),

(8, 'en', 'The technical demands of these works are handled with apparent ease, but it''s the musical insight that impresses most. Tiempo''s understanding of the Romantic piano tradition is evident in every phrase. The recording captures the full dynamic range with remarkable clarity.'),

(9, 'en', 'Roby Lakatos proves once again why he''s considered the king of gypsy violin. His Fire Dance is a tour de force of technical brilliance and emotional intensity. The blend of traditional and contemporary elements creates a unique musical experience that is both familiar and surprising.'),

(10, 'en', 'An absolutely stunning performance that showcases Lakatos at his very best. The Fire Dance suite is performed with such passion and technical mastery that it takes your breath away. The recording quality perfectly captures the intimate yet powerful nature of gypsy violin music.');

-- Insert French translations for some reviews
INSERT INTO public.review_translations (review_id, language, review_text) VALUES 
(1, 'fr', 'Polina Leschenko apporte une perspective fraîche à ces chefs-d''œuvre oubliés. Sa maîtrise technique est évidente, mais c''est sa sensibilité musicale qui captive vraiment. Le cycle de Medtner reçoit une interprétation particulièrement inspirée.'),

(4, 'fr', 'L''album Legacy de Sergio Tiempo témoigne de sa maturité artistique. Le programme s''étend de Bach aux œuvres contemporaines, montrant non seulement une brillance technique mais une compréhension musicale profonde.'),

(9, 'fr', 'Roby Lakatos prouve une fois de plus pourquoi il est considéré comme le roi du violon tzigane. Sa Fire Dance est un tour de force de brillance technique et d''intensité émotionnelle.');

-- Insert German translations for some reviews  
INSERT INTO public.review_translations (review_id, language, review_text) VALUES 
(1, 'de', 'Polina Leschenko bringt eine frische Perspektive zu diesen vergessenen Meisterwerken. Ihre technische Meisterschaft ist offensichtlich, aber es ist ihre musikalische Sensibilität, die wirklich fesselt.'),

(4, 'de', 'Sergio Tiempos Legacy-Album steht als Zeugnis seiner künstlerischen Reife. Das Programm reicht von Bach bis zu zeitgenössischen Werken und zeigt nicht nur technische Brillanz, sondern tiefes musikalisches Verständnis.'),

(9, 'de', 'Roby Lakatos beweist wieder einmal, warum er als König der Zigeunergeige gilt. Sein Fire Dance ist ein Kraftakt technischer Brillanz und emotionaler Intensität.');

-- Update the sequence to start from the next available ID
SELECT setval('public.reviews_id_seq', (SELECT MAX(id) FROM public.reviews) + 1);
SELECT setval('public.review_translations_id_seq', (SELECT MAX(id) FROM public.review_translations) + 1);