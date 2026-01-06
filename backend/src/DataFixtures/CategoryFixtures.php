<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixtures extends Fixture
{
    public const CATEGORIES = [
        't-shirts'     => 'T-shirts',
        'hoodies'      => 'Hoodies',
        'jeans'        => 'Jeans',
        'vestes'       => 'Vestes',
        'accessoires'  => 'Accessoires',
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (self::CATEGORIES as $slug => $name) {
            $category = new Category();
            $category->setName($name);
            $category->setSlug($slug);
            $category->setIsActive(true);

            $manager->persist($category);

            // Référence pour ProductFixtures
            $this->addReference('category_' . $slug, $category);
        }

        $manager->flush();
    }
}
