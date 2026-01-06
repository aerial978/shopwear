<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProductFixtures extends Fixture implements DependentFixtureInterface
{
    private const PRODUCT_COUNT = 25;

    /**
     * Images stables par catégorie
     */
    private const CATEGORY_IMAGES = [
        't-shirts'    => '/images/products/tshirt.jpg',
        'hoodies'     => '/images/products/hoodie.jpg',
        'jeans'       => '/images/products/jeans.jpg',
        'vestes'      => '/images/products/jacket.jpg',
        'accessoires' => '/images/products/accessory.jpg',
    ];

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $categorySlugs = array_keys(CategoryFixtures::CATEGORIES);

        for ($i = 1; $i <= self::PRODUCT_COUNT; $i++) {
            $product = new Product();

            $name = ucfirst($faker->unique()->words(mt_rand(2, 4), true));

            $product->setName($name);
            $product->setSlug($faker->unique()->slug(4));
            $product->setDescription($faker->optional(0.7)->sentence(12));
            $product->setPriceCents($faker->numberBetween(1299, 8999));

            // 90 % de produits actifs
            $product->setIsActive($faker->boolean(90));

            // Catégorie aléatoire parmi les stables
            $categorySlug = $faker->randomElement($categorySlugs);

            /** @var Category $category */
            $category = $this->getReference('category_' . $categorySlug, Category::class);
            $product->setCategory($category);

            // Image liée à la catégorie
            $product->setMainImageUrl(self::CATEGORY_IMAGES[$categorySlug]);

            $manager->persist($product);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CategoryFixtures::class,
        ];
    }
}
